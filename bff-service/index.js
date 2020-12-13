const express = require('express');
require('dotenv').config();

const axios = require('axios').default;
const cors = require('cors');
const cacheService = require('./services/cache-service');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(cors());

app.all('/*', (req, res) => {
    const productService = 'products';
    const getMethod = 'GET';
    let cachedData;

    console.log('originalUrl', req.originalUrl);
    console.log('method', req.method);
    console.log('body', req.body);

    const recipient = req.originalUrl.split('/')[1];
    console.log(recipient);

    const recipientURL = process.env[recipient];
    console.log('recipientURL', recipientURL);

    if (recipientURL) {
        const fullUrlToRecipentService = `${recipientURL}${req.originalUrl}`;

        if (recipient === productService && req.method === getMethod) {

            cachedData = cacheService.findDataByUrl(fullUrlToRecipentService);

            if (cachedData) {
                console.log('cached data of a recipient ', cachedData);
                res.json(cachedData);
            } 
        }

        if (!cachedData)  {
            const axiosConfig = {
                method: req.method,
                url: fullUrlToRecipentService,
                ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
            };

            console.log('axiosConfig', axiosConfig);

            axios(axiosConfig)
                .then(function(response) {
                    if (recipient === productService && req.method === getMethod) {
                        console.log(`data was cached  ${response.data} for the recipient ${fullUrlToRecipentService}`);
                        cacheService.addCache(fullUrlToRecipentService, response.data);
                    }

                    console.log('response from recipient ', response.data);
                    res.json(response.data);
                })
                .catch(error => {
                    console.log('some error: ', JSON.stringify(error));

                    if(error.response) {
                        const {status, data} = error.response;

                        res.status(status).json(data);
                    } else {
                        res.status(500).json({error: error.message})
                    }
                })

        }
    } else {
        res.status(502).json({error: 'Cannot process request'});
    }
});

app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`);
})