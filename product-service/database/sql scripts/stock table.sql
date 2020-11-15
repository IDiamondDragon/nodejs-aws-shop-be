create table stock (
	id uuid primary key default uuid_generate_v4(),
	product_id uuid,
	count integer,
	constraint fk_product 
		foreign key ("product_id") 
			references "product" ("id") 
			on delete cascade
			on update cascade
);


ALTER TABLE stock ADD CONSTRAINT product_id_unique UNIQUE (product_id);