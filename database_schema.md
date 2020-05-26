# capsule_time database schema

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
    unique key(id),
    primary key(user_id)
);

// foreign key (current_row) references refer_table (refer_row)
```

- capsule

```
create table `capsule`(
    capsule_id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    title varchar(100),
    likes INT,
    views INT,
    text varchar(200),
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_viewed TIMESTAMP DEFAULT now() NOT NULL,
    status_temp bool NOT NULL,
    primary key(capsule_id),
    foreign key (user_id) references user (user_id)
);
```

- content

```
create table `content`(
    id int NOT NULL AUTO_INCREMENT,
    content_id int NOT NULL AUTO_INCREMENT,
    capsule_id int NOT NULL,
    url varchar(100) NOT NULL,
    extension varchar(10) NOT NULL,
    size int NOT NULL,
    unique key(id),
    primary key(content_id),
    foreign key (capsule_id) references capsule (capsule_id)
);
```

```
create table `follower`(

);
```



```
create table `capsule_binary`(

);
```

```
create table `position`(

);
```

```
create table `comment`(

);
```

```
create table `tag`(

);
```

```
create table ``(

);
```

## Procedure

        
```
// delimiter $$  : 문장의 끝을 $$로 구분 설정
delimiter $$ 

create procedure test() begin declare i int; set i = 0; while i < 17 do insert into user (user_id, password, nick_name, first_name, last_name, date_created, date_updated) values(concat('id',i), password('123456'), i, concat('first',i), concat('last', i), now(), now()); set i=i+1; end while; end $$

delimiter ;
```
