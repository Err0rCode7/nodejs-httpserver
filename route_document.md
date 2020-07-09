## Users

--- 

### Get Authorization

- Get/ `./users/auth`
    - Get authrization info

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample
    
```json
http://address:port/users/auth"
```

#### Response Form Sample
```json
{
   "nick_name": "__"
}
```

## Capsules

---

### Get Capsules

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

## Contents

--- 

### Get Contents


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



## Like

---

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




#### Post Comment
    
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

#### Delete Comment
    
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

#### Delete Reply
    
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