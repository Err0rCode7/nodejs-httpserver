# capsule_time database schema.md

- user

```
create table `user` (
    id int NOT NULL AUTO_INCREMENT,
    user_id varchar(15) NOT NULL,
    password varchar(100) NOT NULL,
    nick_name varchar(15) NOT NULL,
    first_name varchar(10) NOT NULL,
    last_name varchar(15) NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_updated TIMESTAMP DEFAULT now() NOT NULL,
    primary key(id, user_id)
);

create table `capsule`(

);

create table `user_image`(

);

create table `capsule_binary`(

);

create table `position`(

);

create table `comment`(

);

create table `tag`(

);


```

delimiter $$  : 문장의 끝을 $$로 구분 설정
```
delimiter $$

create procedure test() begin declare i int; set i = 0; while i < 17 do insert into user (user_id, password, nick_name, first_name, last_name, date_created, date_updated) values(concat('id',i), password('123456'), i, concat('first',i), concat('last', i), now(), now()); set i=i+1; end while; end $$

delimiter ;
```
