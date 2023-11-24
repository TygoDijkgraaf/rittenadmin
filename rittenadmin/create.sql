
    create table orders (
        order_id bigint identity not null,
        description varchar(255),
        order_number varchar(255),
        primary key (order_id)
    );

    create table routes (
        route_id bigint identity not null,
        start datetime2(6),
        description varchar(255),
        primary key (route_id)
    );

    create table stops (
        delivered bit,
        order_id bigint not null,
        route_id bigint not null,
        stop_id bigint identity not null,
        house_number varchar(255),
        postal_code varchar(255),
        primary key (stop_id)
    );

    alter table stops 
       add constraint FK3xq56rak4atiw64upi1w8j56g 
       foreign key (order_id) 
       references orders;

    alter table stops 
       add constraint FKj89bt622wq57q3hmubkjgu6il 
       foreign key (route_id) 
       references routes;

    create table orders (
        order_id bigint identity not null,
        description varchar(255),
        order_number varchar(255),
        primary key (order_id)
    );

    create table routes (
        route_id bigint identity not null,
        start datetime2(6),
        description varchar(255),
        primary key (route_id)
    );

    create table stops (
        delivered bit,
        order_id bigint not null,
        route_id bigint not null,
        stop_id bigint identity not null,
        house_number varchar(255),
        postal_code varchar(255),
        primary key (stop_id)
    );

    alter table stops 
       add constraint FK3xq56rak4atiw64upi1w8j56g 
       foreign key (order_id) 
       references orders;

    alter table stops 
       add constraint FKj89bt622wq57q3hmubkjgu6il 
       foreign key (route_id) 
       references routes;
