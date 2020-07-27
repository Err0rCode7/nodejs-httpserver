# Nodejs Restful-API
Developing capsuleTime restful api

---

# End Points

---

## Users

--- 

### Get All Users

- Get/ `./users/`
    - Get all users

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
```json
http://address:port/users
```

#### Response Form Sample
```json
[
    {
        user_id: "182cm______04",
        nick_name: "nick11",
        first_name: "민성",
        last_name: "박",
        email_id: "11",
        email_domain: "1",
        date_created: "2020-06-14T19:17:46.000Z",
        date_updated: "2020-06-14T19:17:46.000Z",
        follow: 1,
        follower: 0,
        image_url: "http://59.13.134.140:7070/contents/1592162266492.jpg",
        image_name: "1592162266492.jpg"
    },
    {
        user_id: "hhheum",
        nick_name: "nick12",
        first_name: "재성",
        last_name: "이",
        email_id: "12",
        email_domain: "12",
        date_created: "2020-06-14T19:20:05.000Z",
        date_updated: "2020-06-14T19:20:05.000Z",
        follow: 0,
        follower: 1,
        image_url: "http://59.13.134.140:7070/contents/1592162405325.jpg",
        image_name: "1592162405325.jpg"
    }
]
```

### Get A User With Nick_name

- Get/ `./users/nick/:nick_name`
    - Get a user has this nick_name

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
```json
http://address:port/users/nick/"Input the nick"
```

#### Response Form Sample

```json
[
    {
        user_id: "182cm______04",
        nick_name: "nick11",
        first_name: "민성",
        last_name: "박",
        email_id: "11",
        email_domain: "1",
        date_created: "2020-06-14T19:17:46.000Z",
        date_updated: "2020-06-14T19:17:46.000Z",
        follow: 1,
        follower: 0,
        image_url: "http://59.13.134.140:7070/contents/1592162266492.jpg",
        image_name: "1592162266492.jpg"
    }
]
```

### Get A User With User_id

- Get/ `./users/user_id`
    - Get a user has this user_id

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
```json
http://address:port/users/"Input the user_id"
```

#### Response Form Sample

```json
[
    {
        user_id: "182cm______04",
        nick_name: "nick11",
        first_name: "민성",
        last_name: "박",
        email_id: "11",
        email_domain: "1",
        date_created: "2020-06-14T19:17:46.000Z",
        date_updated: "2020-06-14T19:17:46.000Z",
        follow: 1,
        follower: 0,
        image_url: "http://59.13.134.140:7070/contents/1592162266492.jpg",
        image_name: "1592162266492.jpg"
    }
]
```

### Post A User

- Post/ `./users/`
    - Post a user

- Success Response : Header with Code 200
- Fail Response : Header with Code 404
- Unauthorized user Response : Header with Code 401 

#### Request Form Sample
    
```json
{
   "user_id": "__",
   "password": __,
   "nick_name": "__",
   "first_name": "__",
   "last_name": "__",
   "email": "__"
}
```

#### Response Form Sample
```json
{
   "success": true
}
```

### Post User Authorization

- Post/ `./users/auth`
    - Post authrization info

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 

#### Request Form Sample
    
```json
@Header(has SessionID)
http://address:port/users/logout/
```

#### Response Form Sample
```json
{
   "nick_name": "__"
}
```

### Post User Logout

- Post/ `./users/logout`
    - Logout user's session

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 

#### Request Form Sample
    
```json

```

#### Response Form Sample
```json
{
   "success": "__"
}
```

### Put A User

- Put/ `./users/`
    - Put a user

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample
    
```json
{
    "pre_nick_name": "__",
    "password": __,
    "new_nick_name": "__"
}
```

#### Response Form Sample
    
```json
{
    "success": "__"
}
```

### Put A User With Image

- Put/ `./users/image`
    - Put a user with image

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample


```json
@multipart
{
    "pre_nick_name": "__",
    "password": __,
    "new_nick_name": "__",
    "file": __
}
```

#### Response Form Sample
    
```json
{
    "success": "__"
}
```

### Delete A User

- Delete/ `./users`
    - Delete a user

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample


```json
http://address:port/users/"Input the nick_name"
```

#### Response Form Sample
    
```json
{
    "success": "__"
}
```

## Capsules

---

### Get Capsules

- Get/ `./capsules/`
    - Response all capsules 

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 

#### Request Form Sample
    
```
http://address:port/capsules"
```

#### Response Form Sample
```json
[
    {
        capsule_id: 20,
        user_id: "182cm______04",
        nick_name: "nick11",
        title: "당일치기 제주도 !!",
        text: "소영이랑 첫 여행으로 부산에 캡슐!! 너무 더워서 기억에 남던 여행~~ 다음에 올때는 우리가 어떻게 달라져있을지 궁금하다~",
        likes: 1,
        views: 0,
        date_created: "2020-06-14T19:21:56.000Z",
        date_opened: "2020-06-14T19:21:56.000Z",
        status_temp: 0,
        lat: 38.1478,
        lng: 128.5405
    },
    {
        capsule_id: 21,
        user_id: "hhheum",
        nick_name: "nick12",
        title: "당일치기 제주도 !!",
        text: "당일치기로 제주도 먹방여행 완전 먹기만해서 +3kg 한 날ㅋㅋㅋㅋ 다음에 올때 뭐 먹었는지 캡슐에 킾~",
        likes: 0,
        views: 0,
        date_created: "2020-06-14T19:26:19.000Z",
        date_opened: "2020-06-14T19:26:19.000Z",
        status_temp: 0,
        lat: 33.506,
        lng: 126.4931
    }
]
```

### Get Capsules With Location
    
- Get/ `./capsules/location?lnt=__&lat=__`
    - Response capsules within 100 meter

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 


#### Request Form Sample
    
```
http://address:port/capsules/location?lnt=__&lat=__
```

#### Response Form Sample
```json
[
    {
        capsule_id: 89,
        nick_name: "nick14",
        title: null,
        text: null,
        likes: 0,
        views: 0,
        date_created: "2020-07-27T07:08:27.000Z",
        date_opened: "2020-07-27T07:08:27.000Z",
        status_temp: 1,
        location: {
            x: 13.0000001,
            y: 13
        },
        expire: null,
        status_lock: 0,
        key_count: 0,
        used_key_count: 0,
        members: [ ]
    },
    {
        capsule_id: 87,
        nick_name: "nick14",
        title: "lockTest1",
        text: "lockTest1",
        likes: 0,
        views: 0,
        date_created: "2020-07-27T06:57:16.000Z",
        date_opened: "2020-07-27T06:57:16.000Z",
        status_temp: 0,
        location: {
            x: 13.0000001,
            y: 13.0000001
        },
        expire: "2020-12-12T02:11:11.000Z",
        status_lock: 1,
        key_count: 2,
        used_key_count: 0,
        members: [
            "nick16",
            "nick17"
        ]
    }
]
```

### Get Capsules with Nick Name
    
- Get/ `./capsules/nick/:nickName`
    - Response capsulelist of A user has nickName 

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
```
http://address:port/capsules/nick/"Input the nick"
```

#### Response Form Sample
```json
[
    {
        capsule_id: 88,
        user_id: "mingso0",
        nick_name: "nick14",
        title: "lockTest1",
        text: "lockTest1",
        likes: 0,
        views: 0,
        date_created: "2020-07-27T07:08:22.000Z",
        date_opened: "2020-07-27T07:08:22.000Z",
        status_temp: 0,
        lat: 13.0000002,
        lng: 13.0000001,
        expire: "2020-12-12T02:11:11.000Z",
        status_lock: 1,
        key_count: 3,
        used_key_count: 0,
        content: [ ],
        members: [
            "nick16",
            "nick17",
            "nick18"
        ]
    },

    {
        capsule_id: 84,
        user_id: "mingso0",
        nick_name: "nick14",
        title: "lockTest1",
        text: "lockTest1",
        likes: 0,
        views: 0,
        date_created: "2020-07-20T12:15:34.000Z",
        date_opened: "2020-07-20T12:15:34.000Z",
        status_temp: 0,
        lat: 37.6057548522949,
        lng: 127.009429931641,
        expire: null,
        status_lock: 0,
        key_count: 0,
        used_key_count: 0,
        content: [ ],
        members: [
            "nick16",
            "nick17",
            "nick18"
        ]
    }
]
```

### Get Capsules with Follow For Follow and Nick Name
    
- Get/ `./capsules/f4f/:nickName`
    - Response list of capsules which friends made

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
```
http://address:port/capsules/nick/"Input the nick"
```

#### Response Form Sample
```json
[
    {
        capsule_id: 33,
        user_id: "x_sungjun_x",
        nick_name: "nick15",
        title: "당일치기 제주도 !!",
        text: "소영이랑 첫 여행으로 부산에 캡슐!! 너무 더워서 기억에 남던 여행~~ 다음에 올때는 우리가 어떻게 달라져있을지 궁금하다~",
        likes: 0,
        views: 0,
        date_created: "2020-06-14T19:49:07.000Z",
        date_opened: "2020-06-14T19:49:07.000Z",
        status_temp: 0,
        lat: 37.431,
        lng: 126.6801,
        expire: null,
        status_lock: 0,
        key_count: 0,
        used_key_count: 0,
        content: [ ],
        members: [ ]
    },
    {
        capsule_id: 24,
        user_id: "x_sungjun_x",
        nick_name: "nick15",
        title: "당일치기 제주도 !!",
        text: "소영이랑 첫 여행으로 부산에 캡슐!! 너무 더워서 기억에 남던 여행~~ 다음에 올때는 우리가 어떻게 달라져있을지 궁금하다~",
        likes: 0,
        views: 0,
        date_created: "2020-06-14T19:28:57.000Z",
        date_opened: "2020-06-14T19:28:57.000Z",
        status_temp: 0,
        lat: 37.5382,
        lng: 126.9772,
        expire: null,
        status_lock: 0,
        key_count: 0,
        used_key_count: 0,
        content: [
            {
                content_id: 47,
                url: "http://59.13.134.140:7070/contents/1592162947453.jpg"
            }
        ],
        members: [ ]
    }
]
```

### Get Capsules With Capsule_id
    
- Get/ `./capsules/:capsule_id`
    - Response a capsule has this capsule_id

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
```
http://address:port/capsules/nick/"Input the capsule_id"
```

#### Response Form Sample
```json
{
    capsule_id: 84,
    user_id: "mingso0",
    nick_name: "nick14",
    title: "lockTest1",
    text: "lockTest1",
    likes: 0,
    views: 0,
    date_created: "2020-07-20T12:15:34.000Z",
    date_opened: "2020-07-20T12:15:34.000Z",
    status_temp: 0,
    lat: 37.6057548522949,
    lng: 127.009429931641,
    expire: "2020-12-12T02:11:11.000Z",
    status_lock: 1,
    key_count: 3,
    used_key_count: 0,
    content: [ ],
    members: [
        "nick16",
        "nick17",
        "nick18"
    ]
}
```

### Post Capsules

- Post/ `./capsules`
    - Post a capsule stored temporally

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample
    
```json
{
	"nick_name" : "__",
	"lat": __,
	"lng": __
}
```

#### Response Form Sample
```json
{
    "success": true
}
```

### Put Capsules

- Put/ `./capsules`
    - Put a capsule

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample
    
```json
{
    "capsule_id" : __,
    "text": "__",
    "title": "__"
}
```

#### Response Form Sample
```json
{
    "success": true
}
```

### Put Capsules With Images

- Put/ `./capsules/with/images`
    - Put a capsule with image

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample
    
```json
@multipart
"capsule_id" : __,
"text": __,
"title": __
"file": 
```

#### Response Form Sample
```json
{
    "success": true
}
```

### Put LockedCapsules

- Put/ `./capsules/lock`
    - Put a capsule

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample
    
```json
{
    "capsule_id" : __,
    "text": "__",
    "title": "__",
    "expire": "YYYY-MM-DD hh:mm:ss",
    "members": [
        "friend1_nick",
        "friedn2_nick"
    ]
}
```

#### Response Form Sample
```json
{
    "success": true
}
```

### Put LockedCapsules With Images

- Put/ `./capsules/lock/images`
    - Put a capsule with image

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample
    
```json
@multipart
"capsule_id" : __,
"text": "__",
"title": "__",
"expire": "YYYY-MM-DD hh:mm:ss",
"members": [
    "friend1_nick",
    "friedn2_nick"
]
"file":
```

#### Response Form Sample
```json
{
    "success": true
}
```

### Delete Capsule With Capsule_id

- Delete/ `./capsules/:capsuleId`
    - Delete a capsule with capsule_id

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample
    
```json
http://address:port/capsules/"Input the capsule_id"
```

#### Response Form Sample
```json
{
    "success": true
}
```

## Contents

--- 

### Get Content With Content_name

- Get/ `./:content_name
    - Response a content

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 

#### Request Form Sample
    
```json
http://address:port/contents/"Input the content_name"
```

#### Response Form Sample

```
Stream A image data
```

### Get Content information With Capsule_id

- Get/ `./capsule-id/:capsuleId`
    - Response information of contents from a capsule has capsule_id

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
```json
http://address:port/contents/capsule-id/"Input the capsule_id"
```

#### Response Form Sample
```json
[
    {
        content_id: 48,
        content_name: "1592163019288.jpg",
        capsule_id: 25,
        url: "http://118.44.168.218:7070/contents/1592163019288.jpg",
        extension: ".jpg",
        size: 150094
    },

    {
        ...
    }
]
```

### Post Contents

- Post/ `./:content_name`
    - Post contents

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 

#### Request Form Sample
```json
@multipart
file: list of files
```

#### Response Form Sample
```json
{
    "success": true
}
```

### Delete Content With Content_name

- Delete/ `./:content_name`
    - Delete a content

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
```json
http://address:port/contents/"Input the content_id"
```

#### Response Form Sample
```json
{
    "success": true
}
```

## Follow

--- 

### Get Follow List
    
- Get/ `./follow/followlist/:nickName`
    - response followlist of A user has nickName 

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
```
http://address:port/follow/followlist/"Input the Nick"
```

#### Response Form Sample
```json
    [
        {
        nick_name: "nick11",
        first_name: "민성",
        last_name: "박",
        date_created: "2020-06-14T19:17:46.000Z",
        date_updated: "2020-06-14T19:17:46.000Z",
        follow: 1,
        follower: 0,
        image_url: "http://118.44.168.218:7070/contents/1592162266492.jpg",
        image_name: "1592162266492.jpg"
        },

        {
            ...
        },

        {
            ...
        }
    ]
```

### Get Follower List
    
- Get/ `./follow/followerlist/:nickName`
    - response followerlist of A user has nickName 

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
```
http://address:port/follow/followerlist/"Input the Nick"
```

#### Response Form Sample
```json
    [
        {
        nick_name: "nick11",
        first_name: "민성",
        last_name: "박",
        date_created: "2020-06-14T19:17:46.000Z",
        date_updated: "2020-06-14T19:17:46.000Z",
        follow: 1,
        follower: 0,
        image_url: "http://118.44.168.218:7070/contents/1592162266492.jpg",
        image_name: "1592162266492.jpg"
        },

        {
            ...
        },

        {
            ...
        }
    ]
```

### Get Follow List with Follow For Follow
    
- Get/ `./follow/forfollow/list/:nickName`
    - Response list of users who have f4f relation with a user has nickName

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
```
http://address:port/capsules/nick/"Input the nick"
```

#### Response Form Sample
```json
[
    {
        nick_name: "nini22",
        first_name: "민성",
        last_name: "박",
        date_created: "2020-06-14T19:17:46.000Z",
        date_updated: "2020-07-19T02:56:31.000Z",
        follow: 1,
        follower: 1,
        image_url: "http://59.13.134.140:7070/contents/1592162266492.jpg",
        image_name: "1592162266492.jpg"
    },
    {
        nick_name: "nick13",
        first_name: "세종",
        last_name: "김",
        date_created: "2020-06-14T19:21:30.000Z",
        date_updated: "2020-06-14T19:21:30.000Z",
        follow: 1,
        follower: 1,
        image_url: "http://59.13.134.140:7070/contents/1592162490258.jpg",
        image_name: "1592162490258.jpg"
    }
]
```

### Post Follow
    
- Post/ `./follow/`
    - user's follow is added 1
    - dest's follwer is added 1
    - create a row of follow table in DB

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample
    
```json
{
    "nick_name" : "__",
    "dest_nick_name" : "__" 
}
```

#### Response Form Sample
```json
    [
        {
        nick_name: "nick11",
        first_name: "민성",
        last_name: "박",
        date_created: "2020-06-14T19:17:46.000Z",
        date_updated: "2020-06-14T19:17:46.000Z",
        follow: 1,
        follower: 0,
        image_url: "http://118.44.168.218:7070/contents/1592162266492.jpg",
        image_name: "1592162266492.jpg"
        },

        {
            ...
        },

        {
            ...
        }
    ]
```

### Delete follow

- Delete/ `./follow?nick_name="__"&dest_nick_name="__"`
    - user's follow is subtracted 1
    - dest's follower is subtracted 1
    - delete a row of follow table in DB 

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample
```json
http://address:port/like?nick_name="__"&dest_nick_name="__"
```

#### Response Form Sample
```json
{
   "success": true
}
```

## Like

---

### Post Like

- Post/ `./like/` 
    - like of the capsule of user is added 1
    - create a row of like table in DB 

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401
    
#### Request Form sample
```json
{
    "capsule_id" : __,
    "nick_name" : "__" 
}
```
#### Response Form sample

```json
{
   "success": true
}
```

### Delete Like
    
- Delete/ `./like?capsule_id=__&nick_name="__"`
    - like of the capsule of user is subtracted 1
    - delete a row of like table in DB 

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401
    
#### Request Form sample
```
http://address:port/like?capsule_id=__&nick_name="__"
```

#### Response Form sample

```json
{
   "success": true
}
```

## Comment

--- 

### Get Comment
    
- Get/ `./comment/list/:capsule_id`
    - response list of comments

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 

#### Request Form Sample
```
http://address:port/comment/list/"Input the Capsule Id"
```

#### Response Form Sample

```json
[
    {
        nick_name: "nick11",
        comment: "Test1",
        date_created: "2020-07-15T11:49:04.000Z",
        date_updated: "2020-07-15T11:49:04.000Z",
        user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg",
        replies: [
            {
                nick_name: "nick11",
                comment: "Test5",
                date_created: "2020-07-15T11:49:39.000Z",
                date_updated: "2020-07-15T11:49:39.000Z",
                user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg"
            },
            {
                nick_name: "nick11",
                comment: "Test6",
                date_created: "2020-07-15T11:49:43.000Z",
                date_updated: "2020-07-15T11:49:43.000Z",
                user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg"
            },
            {
                nick_name: "nick11",
                comment: "Test7",
                date_created: "2020-07-15T11:49:46.000Z",
                date_updated: "2020-07-15T11:49:46.000Z",
                user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg"
            },
            {
                nick_name: "nick12",
                comment: "Test10",
                date_created: "2020-07-15T11:50:10.000Z",
                date_updated: "2020-07-15T11:50:10.000Z",
                user_image_url: "http://211.248.58.81:7070/contents/1592162405325.jpg"
            },
            {
                nick_name: "nick11",
                comment: "Test8",
                date_created: "2020-07-15T11:49:52.000Z",
                date_updated: "2020-07-15T11:49:52.000Z",
                user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg"
            },
            {
                nick_name: "nick13",
                comment: "Test10",
                date_created: "2020-07-15T11:50:16.000Z",
                date_updated: "2020-07-15T11:50:16.000Z",
                user_image_url: "http://211.248.58.81:7070/contents/1592162490258.jpg"
            }
        ]
    },
    {
        nick_name: "nick11",
        comment: "Test2",
        date_created: "2020-07-15T11:49:06.000Z",
        date_updated: "2020-07-15T11:49:06.000Z",
        user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg",
        replies: [ ]
    },
    {
        nick_name: "nick11",
        comment: "Test3",
        date_created: "2020-07-15T11:49:09.000Z",
        date_updated: "2020-07-15T11:49:09.000Z",
        user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg",
        replies: [
            {
            nick_name: "nick11",
            comment: "Test9",
            date_created: "2020-07-15T11:49:59.000Z",
            date_updated: "2020-07-15T11:49:59.000Z",
            user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg"
            }
        ]
    }
]
```

### Post Comment

- Post/ `./comment`
    - Create a Comment

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample
    
- case 1 (Parent Comment)
```json
{
    "capsule_id" : __,
    "nick_name" : "__",
    "conmment": ""
}
```
- case 2 (Child Comment : reply)
```json
{
    "capsule_id" : __,
    "nick_name" : "__",
    "conmment": "",
    "parent_id": __
}
```
#### Response Form Sample

```json
{
   "success": true
}
```

### Delete Comment
    
- Delete/ `./comment/:id`
    - Delete a Comment

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample
    
```json
http://address:port/comment/"Input the Comment ID"
```

#### Response Form Sample
```json
{
   "success": true
}
```

### Delete Reply
    
- Delete/ `./comment/reply/:id`
    - Delete a Reply

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample
    
```json
http://address:port/comment/reply/"Input the Comment ID"
```

#### Response Form Sample
```json
{
   "success": true
}
```

## Session

--- 

### Check Authorized Session
    
- Get/ `./comment/list/:capsule_id`
    - response nick_name if session in header is valid;

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 

#### Request Form Sample
```
http://address:port/comment/list/"Input the Capsule Id"
```

#### Response Form Sample
```json
{
    "nick_name": "__"
}
```