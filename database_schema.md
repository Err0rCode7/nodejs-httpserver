# capsule_time database schema

- user

```
create table `user` (
    id int UNSIGNED NOT NULL AUTO_INCREMENT unique,
    user_id varchar(15) NOT NULL unique,
    password varchar(100) NOT NULL,
    email_id varchar(64) NOT NULL,
    email_domain varchar(255) NOT NULL,
    nick_name varchar(15) character set utf8 NOT NULL,
    first_name varchar(10) character set utf8 NOT NULL,
    last_name varchar(15) character set utf8 NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_updated TIMESTAMP DEFAULT now() NOT NULL,
    follower INT UNSIGNED DEFAULT 0 NOT NULL,
    follow INT UNSIGNED DEFAULT 0 NOT NULL,
    image_url varchar(100) DEFAULT NULL,
    image_name varchar(25) DEFAULT NULL,
    unique key(email_id, email_domain),
    primary key(id, user_id)
);

// unique key(id)
// foreign key (current_row) references refer_table (refer_row)

// user test
// insert into user (user_id, password, nick_name, first_name, last_name, email_id, email_domain) values('id1', password('123456'), 'nick', 'first', 'last', 'aa123', 'naver.com');
```

- capsule

```
create table `capsule`(
    capsule_id int UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id varchar(15) NOT NULL,
    title varchar(100) character set utf8,
    likes INT UNSIGNED DEFAULT 0 NOT NULL,
    views INT UNSIGNED DEFAULT 0 NOT NULL,
    text varchar(200) character set utf8,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_opened TIMESTAMP DEFAULT now() NOT NULL,
    status_temp boolean DEFAULT true NOT NULL,
    location point NOT NULL,
    primary key(capsule_id),
    foreign key (user_id) references user (user_id) on delete cascade
) ENGINE=InnoDB;

// insert capsule
// insert into capsule (user_id, title, likes, views, text, date_created, date_opened, status_temp) values('id1', 'Hello World', '');
// insert into capsule (user_id, status_temp, location) values('id1', true, point(126.955869, 37.546037));

// select position 
// select x(location) as 'lng', y(location) as 'lat' from capsule;

```

- content

```
create table `content`(
    content_id int UNSIGNED NOT NULL AUTO_INCREMENT,
    content_name varchar(25) NOT NULL unique,
    capsule_id int UNSIGNED NOT NULL,
    url varchar(100) NOT NULL,
    extension varchar(10) NOT NULL,
    size int UNSIGNED NOT NULL,
    primary key(content_id),
    foreign key (capsule_id) references capsule (capsule_id) on delete cascade
);

// insert content
// insert into content (content_name, capsule_id, url, extension, size) values('1591002276119.mp4', 1, '118.44.168.218:7070/contents/1591002451891.mp4', '.mp4', 8799495);
// insert into content (content_name, capsule_id, url, extension, size) values('1591003376304.mp4', 2, '118.44.168.218:7070/contents/1591003376304.mp4', '.mp4', 22567559);
// insert into content (content_name, capsule_id, url, extension, size) values('1591003456370.mp4', 3, '118.44.168.218:7070/contents/1591003456370.mp4', '.mp4', 5143816);


```

```
create table `follower`(
    id, pk
    user_id, fk
    follow_id, fk
);
```

```
create table `like`(
    id, pk
    user_id, fk
    capsule_id, fk
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

    - 여러 user 만드는 Procedure
        
```
// delimiter $$  : 문장의 끝을 $$로 구분 설정
delimiter $$ 

create procedure test() begin declare i int; set i = 0; while i < 17 do insert into user (user_id, password, nick_name, first_name, last_name, date_created, date_updated, email_id, email_domain) values(concat('id',i), password('123456'), i, concat('first',i), concat('last', i), now(), now(), concat('email',i), 'gmail.com'); set i=i+1; end while; end $$

delimiter ;

// 실행
call test();
```

## Function
    - 위도, 경로 거리 계산 함수
```
delimiter $$

CREATE
    FUNCTION `u_st_distance_sphere`(`pt1` POINT, `pt2` POINT)
    RETURNS DECIMAL(10,2)
    BEGIN
	RETURN 6371 * 2 * ASIN(SQRT(POWER(SIN((ST_Y(pt2) - ST_Y(pt1)) * PI()/180 / 2), 2) + COS(ST_Y(pt1) * PI()/180 ) * COS(ST_Y(pt2) * PI()/180) * POWER(SIN((ST_X(pt2) - ST_X(pt1)) * PI()/180 / 2), 2) ));
    END$$

delimiter ;
```