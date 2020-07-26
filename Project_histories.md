# nodejs-httpserver
Develope http-streaming-server

## Completed - 1
(2020/05/18 ~ 2020/05/27)

---

- users 
    - Get/ `./users/`
    - Response JSON about all of users 

        ![image](https://user-images.githubusercontent.com/48249549/83009436-bb191600-a051-11ea-90bf-ddceab46c525.png)

    - Get/ `./users/:id/` 
    - Response JSON about a user

        ![image](https://user-images.githubusercontent.com/48249549/83009360-991f9380-a051-11ea-96f6-38c142a5fd7e.png)

    - Post/ `./users/` 
    - Register a user ( Inster a user ) 

        ![image](https://user-images.githubusercontent.com/48249549/83010262-f23bf700-a052-11ea-9d1a-b228d7dba562.png)

    - Put/ `./users/` 
    - Update data of a user 

        ![image](https://user-images.githubusercontent.com/48249549/83010799-ca00c800-a053-11ea-9157-bc7a4133978b.png)

    - Delete/ `./users/` 
    - Delete a user 

        ![image](https://user-images.githubusercontent.com/48249549/83010614-7d1cf180-a053-11ea-9708-f793fbabf7d1.png) 

        ![image](https://user-images.githubusercontent.com/48249549/83009810-472b3d80-a052-11ea-8b82-b0fa405eecbf.png)
    ---
    - Post/ `./users/auth/` 
    - Check authorization(login) of a user 
    - [Android](https://github.com/Err0rCode7/capsule-time-android) 에서 테스트 완료

- contents ( image or video )

    - Get/ `./contents/:contentId` 
    - Response content with content ID 

        ![image](https://user-images.githubusercontent.com/48249549/83011078-4693a680-a054-11ea-9e0a-2ee000d7607d.png)

    - Get/ `contents/capsule-id/:capsuleId` 
    - Response contentID 
    
    - Post/ `./contents/` 
    - Upload a content or a nubmer of contents 
    - with multipart/form-data

        ![image](https://user-images.githubusercontent.com/48249549/83015039-c58bdd80-a05a-11ea-9604-dcc080c1c159.png)

    - Put/ `./contents/`    Dont need 
    - Dont develope

    - Delete/ `./contents/contentId` 
    - Delete a content 


## Completed - 2
( 2020/05/28 ~ 2020/06/03 )

---
- capsules 

    - Get/ `./capsules/`
    - Response JSON about all of Capsules 

        ![image](https://user-images.githubusercontent.com/48249549/83625774-72bca380-a5cf-11ea-9bcb-2b38580bf536.png)

    - Get/ `./capsules/capsuleID` 
    - Response JSON about a Capsule

        ![image](https://user-images.githubusercontent.com/48249549/83626030-d777fe00-a5cf-11ea-88d6-28845bdd37cc.png)

    - Get/ `./capsules/location?lat=__&lng=__`
    - Response Json about capsules within 5KM

        ![image](https://user-images.githubusercontent.com/48249549/83626287-2887f200-a5d0-11ea-856f-7378e92d3c9c.png)

    - Get/ `./capsules/user?user_id=__`
    - Response Json about capsules of a user

        ![image](https://user-images.githubusercontent.com/48249549/83626440-6258f880-a5d0-11ea-997c-9f2baf23bf81.png)

    - Post/ `./capsules`
    - Post a capsule temporarily 

        ![image](https://user-images.githubusercontent.com/48249549/83626561-903e3d00-a5d0-11ea-98de-3c1bc42f89b1.png)

    - Put/ `./capsules`
    - Complete a posted capsule 
    - with multipart/form-data

        ![image](https://user-images.githubusercontent.com/48249549/83626849-0347b380-a5d1-11ea-820a-40124cd62c23.png)

        - 결과

        ![image](https://user-images.githubusercontent.com/48249549/83627094-65a0b400-a5d1-11ea-8b9c-df9dd6d388cd.png)


    - Delete/ `./capsules`
    - Delete all about a capsule

        ![image](https://user-images.githubusercontent.com/48249549/83627209-8a952700-a5d1-11ea-9916-d5f56fcf0258.png)

        - 결과

        ![image](https://user-images.githubusercontent.com/48249549/83627271-9d0f6080-a5d1-11ea-827e-0ab18e894249.png)

## Completed - 3
( 2020/7/5 ~ 2020/7/8 )

---

### Follow - 1

### Post Follow
    
- Post/ `./follow/`
    - user's follow is added 1
    - dest's follwer is added 1
    - create a row of follow table in DB

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

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

### Post Like

- Post/ `./like/` 
    - like of the capsule of user is added 1
    - create a row of like table in DB 

- Success Response : Header with Code 200
- Fail Response : Header with Code 404
    
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

## Completed - 4
( 2020/7/8 ~ 2020/7/10 )

---

### Follow - 2

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

### Get Capsules with Nick Name
    
- Get/ `./capsules/nick/:nickName`
    - response capsulelist of A user has nickName 

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
```
http://address:port/capsule/nick/"Input the Nick"
```

#### Response Form Sample
```json
[
    {
        capsule_id: 63,
        user_id: "hhheum",
        nick_name: "nick12",
        title: "hhh",
        text: "hhh",
        likes: 0,
        views: 0,
        date_created: "2020-07-07T13:37:01.000Z",
        date_opened: "2020-07-07T13:37:01.000Z",
        status_temp: 0,
        lat: 56,
        lng: 100,
        content: [
            {
                content_id: null,
                url: null
            }
        ]
    },
    {
        capsule_id: 62,
        user_id: "hhheum",
        nick_name: "nick12",
        title: "소영이랑 첫 여행!!",
        text: "소영이랑 첫 여행으로 부산에 캡슐!! 너무 더워서 기억에 남던 여행~~ 다음에 올때는 우리가 어떻게 달라져있을지 궁금하다~~",
        likes: 0,
        views: 0,
        date_created: "2020-07-01T05:22:17.000Z",
        date_opened: "2020-07-01T05:22:17.000Z",
        status_temp: 0,
        lat: 35.1567,
        lng: 129.1524,
        content: [
            {
                content_id: 58,
                url: "http://118.44.168.218:7070/contents/1593581760709.jpg"
            },
            {
                content_id: 59,
                url: "http://118.44.168.218:7070/contents/1593581760717.jpg"
            }
        ]
    }
]
```

### Post Capsules

- Post/ `./capsules`
    - Post a capsule stored temporally

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

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
        nick_name: "nick12",
        comment: "comment Test1",
        date_created: "2020-07-09T15:44:27.000Z",
        date_updated: "2020-07-09T15:44:27.000Z",
        replies: [ ]
    },
    {
        nick_name: "nick12",
        comment: "comment Test2",
        date_created: "2020-07-09T15:44:31.000Z",
        date_updated: "2020-07-09T15:44:31.000Z",
        replies: [
            {
                nick_name: "nick12",
                comment: "comment Test9",
                date_created: "2020-07-09T15:46:13.000Z",
                date_updated: "2020-07-09T15:46:13.000Z"
            }
        ]
    },
    {
        nick_name: "nick12",
        comment: "comment Test3",
        date_created: "2020-07-09T15:44:33.000Z",
        date_updated: "2020-07-09T15:44:33.000Z",
        replies: [ ]
    },
    {
        nick_name: "nick12",
        comment: "comment Test4",
        date_created: "2020-07-09T15:44:36.000Z",
        date_updated: "2020-07-09T15:44:36.000Z",
        replies: [
            {
                nick_name: "nick12",
                comment: "comment Test6",
                date_created: "2020-07-09T15:46:01.000Z",
                date_updated: "2020-07-09T15:46:01.000Z"
            },
            {
                nick_name: "nick12",
                comment: "comment Test7",
                date_created: "2020-07-09T15:46:05.000Z",
                date_updated: "2020-07-09T15:46:05.000Z"
            },
            {
                nick_name: "nick12",
                comment: "comment Test8",
                date_created: "2020-07-09T15:46:08.000Z",
                date_updated: "2020-07-09T15:46:08.000Z"
            }
        ]
    },
    {
        nick_name: "nick12",
        comment: "comment Test5",
        date_created: "2020-07-09T15:44:40.000Z",
        date_updated: "2020-07-09T15:44:40.000Z",
        replies: [ ]
    }
]
```

### Post Capsules

- Post/ `./comment`
    - Create a Comment

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
- case 1 (Parent Comment)
```json
{
    "user_id" : "__",
    "capsule_id" : __,
    "nick_name" : "__",
    "conmment": ""
}
```
- case 2 (Child Comment : reply)
```json
{
    "user_id" : "__",
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

### Users

--- 

### Post Users Authorization

- Post/ `./users/auth`
    - Post authrization info

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
```json
{
   "user_id": "__",
   "password": __,
}
```

#### Response Form Sample
```json
{
   "nick_name": "__"
}
```

## Completed - 5
(2020/07/11 ~ 2020/7/26)

### Comment list
- Update Get-Comment-list Router(Add user_image_url) and Post-Comment,Reply (delete user_id)
- Update Get-capsules Router (with location, with nick_name, with capsule id)
- Add Session Router (Restful server and android app)
- Add Logout Router (Destroy Session)
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