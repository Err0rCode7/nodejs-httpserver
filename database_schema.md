# capsule_time database schema

- user

```sql
create table `user` (
    id int UNSIGNED NOT NULL AUTO_INCREMENT unique,
    user_id varchar(15) NOT NULL unique,
    password varchar(100) NOT NULL,
    email_id varchar(64) NOT NULL,
    email_domain varchar(255) NOT NULL,
    nick_name varchar(15) character set utf8 NOT NULL unique,
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

```sql
create table `capsule`(
    capsule_id int UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id varchar(15) NOT NULL,
    nick_name varchar(15) character set utf8 NOT NULL,
    title varchar(100) character set utf8,
    likes INT UNSIGNED DEFAULT 0 NOT NULL,
    views INT UNSIGNED DEFAULT 0 NOT NULL,
    text varchar(400) character set utf8,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_opened TIMESTAMP DEFAULT now() NOT NULL,
    status_temp boolean DEFAULT true NOT NULL,
    location point NOT NULL,
    primary key(capsule_id),
    CONSTRAINT CAPSULE_USER_ID_FK foreign key (user_id) references user (user_id) on delete cascade on update cascade,
    CONSTRAINT CAPSULE_NICK_FK foreign key (nick_name) references user (nick_name) on delete cascade on update cascade
    
) ENGINE=InnoDB;

# insert capsule
# insert into capsule (user_id, title, likes, views, text, date_created, date_opened, status_temp) values('id1', 'Hello World', '');
# insert into capsule (user_id, status_temp, location) values('id1', true, point(126.955869, 37.546037));

# select position 
# select x(location) as 'lng', y(location) as 'lat' from capsule;

```

- content

```sql
create table `content`(
    content_id int UNSIGNED NOT NULL AUTO_INCREMENT,
    content_name varchar(25) NOT NULL unique,
    capsule_id int UNSIGNED NOT NULL,
    url varchar(100) NOT NULL,
    extension varchar(10) NOT NULL,
    size int UNSIGNED NOT NULL,
    primary key(content_id),
    CONSTRAINT CONTENT_CAPSULE_ID_FK foreign key (capsule_id) references capsule (capsule_id) on delete cascade on update cascade
);

# insert content
# insert into content (content_name, capsule_id, url, extension, size) values('1591002276119.mp4', 1, '118.44.168.218:7070/contents/1591002451891.mp4', '.mp4', 8799495);
# insert into content (content_name, capsule_id, url, extension, size) values('1591003376304.mp4', 2, '118.44.168.218:7070/contents/1591003376304.mp4', '.mp4', 22567559);
# insert into content (content_name, capsule_id, url, extension, size) values('1591003456370.mp4', 3, '118.44.168.218:7070/contents/1591003456370.mp4', '.mp4', 5143816);


```

- follow

```sql
create table `follow`(
    id int UNSIGNED NOT NULL AUTO_INCREMENT,
    nick_name varchar(15) character set utf8 NOT NULL,
    dest_nick_name varchar(15) character set utf8 NOT NULL,
    unique key(nick_name, dest_nick_name),
    primary key(id),
    CONSTRAINT FOLLOW_USER_NICK_FK foreign key (nick_name) references user (nick_name) on delete cascade on update cascade,
    CONSTRAINT FOLLOW_DEST_NICK_FK foreign key (dest_nick_name) references user (nick_name) on delete cascade on update cascade
);
```

- like

```sql
create table `likeCapsule`(
    id int UNSIGNED NOT NULL AUTO_INCREMENT,
    nick_name varchar(15) character set utf8 NOT NULL,
    capsule_id int UNSIGNED NOT NULL,
    unique key(nick_name, capsule_id),
    primary key(id),
    CONSTRAINT LIKE_CAPSULE_ID_FK foreign key (capsule_id) references capsule (capsule_id) on delete cascade on update cascade,
    CONSTRAINT LIKE_USER_NICK_FK foreign key (nick_name) references user (nick_name) on delete cascade on update cascade
);
```

- comment 
```sql
create table `comment`(
    id int UNSIGNED NOT NULL AUTO_INCREMENT,
    nick_name varchar(15) character set utf8 NOT NULL,
    capsule_id int UNSIGNED NOT NULL,
    comment varchar(400) character set utf8,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_updated TIMESTAMP DEFAULT now() NOT NULL,
    primary key(id),
    CONSTRAINT COMMENT_CAPSULE_ID_FK foreign key (capsule_id) references capsule (capsule_id) on delete cascade on update cascade,
    CONSTRAINT COMMENT_NICK_FK foreign key (nick_name) references user (nick_name) on delete cascade on update cascade
);
```

- reply
```sql
create table `reply`(
    id int UNSIGNED NOT NULL AUTO_INCREMENT,
    nick_name varchar(15) character set utf8 NOT NULL,
    capsule_id int UNSIGNED NOT NULL,
    parent_id int UNSIGNED NOT NULL, 
    comment varchar(400) character set utf8,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_updated TIMESTAMP DEFAULT now() NOT NULL,
    primary key(id),
    CONSTRAINT REPLY_CAPSULE_ID_FK foreign key (capsule_id) references capsule (capsule_id) on delete cascade on update cascade,
    CONSTRAINT REPLY_NICK_FK foreign key (nick_name) references user (nick_name) on delete cascade on update cascade,
    CONSTRAINT REPLY_PARENT_FK foreign key (parent_id) references comment (id) on delete cascade on update cascade
);
```

- tags
```sql
create table `tags`(
    tag_id int UNSIGNED NOT NULL AUTO_INCREMENT,
    name varchar(15) NOT NULL,
    primary key(tag_id)
);
```

- tagMap
```sql
create table `tagMap`(
    capsule_id int UNSIGNED NOT NULL,
    tag_id int UNSIGNED NOT NULL AUTO_INCREMENT,
    primary key(capsule_id, tag_id),
    CONSTRAINT TAGMAP_CAPSULE_ID_FK foreign key (capsule_id) references capsule (capsule_id) on delete cascade on update cascade,
    CONSTRAINT TAGMAP_TAG_ID_FK foreign key (tag_id) references tags (tag_id) on delete cascade on update cascade
);
```

- session
```sql
create table `sessions`(
    session_id varchar(128) not null primary,
    expires unsigned int(11) not null,
    data mediumtext,
);
```

- lockedCapsule
```sql
create table `lockedCapsule`(
    id int UNSIGNED NOT NULL AUTO_INCREMENT,
    capsule_id int UNSIGNED NOT NULL,
    expire TIMESTAMP DEFAULT now() NOT NULL,
    status_lock boolean DEFAULT true NOT NULL,
    key_count int UNSIGNED DEFAULT 0 NOT NULL,
    used_key_count int UNSIGNED DEFAULT 0 NOT NULL,
    CONSTRAINT LOCKED_CAPSULE_ID_FK foreign key (capsule_id) references capsule (capsule_id) on delete cascade on update cascade,
    unique key(capsule_id),
    primary key(id)
);
```

- sharedCapsueUser
```sql
create table `sharedCapsuleUser`(
    id int UNSIGNED NOT NULL AUTO_INCREMENT,
    nick_name varchar(15) character set utf8 NOT NULL,
    capsule_id int UNSIGNED NOT NULL,
    CONSTRAINT SHARED_CAPSULE_USER_CAPSULE_ID_FK foreign key (capsule_id) references capsule (capsule_id) on delete cascade on update cascade,
    CONSTRAINT SHARED_CAPSULE_USER_NICK_FK foreign key (nick_name) references user (nick_name) on delete cascade on update cascade,
    unique key(nick_name, capsule_id),
    primary key(id)
);
```


## Procedure

    - 여러 user 만드는 Procedure
        
```sql
# delimiter $$  : 문장의 끝을 $$로 구분 설정
delimiter $$ 

create procedure test() begin declare i int; set i = 0; while i < 17 do insert into user (user_id, password, nick_name, first_name, last_name, date_created, date_updated, email_id, email_domain) values(concat('id',i), password('123456'), i, concat('first',i), concat('last', i), now(), now(), concat('email',i), 'gmail.com'); set i=i+1; end while; end $$

delimiter ;

// 실행
call test();
```

## Function
    - 위도, 경로 거리 계산 함수
```sql
delimiter $$

CREATE
    FUNCTION `u_st_distance_sphere`(`pt1` POINT, `pt2` POINT)
    RETURNS DECIMAL(10,5)
    BEGIN
	RETURN 6371 * 2 * ASIN(SQRT(POWER(SIN((ST_Y(pt2) - ST_Y(pt1)) * PI()/180 / 2), 2) + COS(ST_Y(pt1) * PI()/180 ) * COS(ST_Y(pt2) * PI()/180) * POWER(SIN((ST_X(pt2) - ST_X(pt1)) * PI()/180 / 2), 2) ));
    END$$

delimiter ;
```


### 제약조건 조회

```sql
select constraint_name, constraint_type from information_schema.table_constraints where TABLE_NAME = 'likeCapsule';
```

### Drop Foreign key constraint

```sql
alter table likeCapsule drop foreign key likeCapsule_ibfk_2;
```

### Add Froeign key constraint

```sql
alter table likeCapsule add constraint __ foreign key __;
```
