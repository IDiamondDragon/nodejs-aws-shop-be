create table product (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer
)