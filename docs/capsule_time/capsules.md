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
            {
                nick_name : "nick16",
                status_key : 1
            },
            {
                nick_name : "nick17",
                status_key : 1
            }
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

### Get Capsules with Follow and Nick Name

- Get/ `./capsules/follow/:nickName`
  - Response list of capsules which a user of follow-list-members made

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample

```
http://address:port/capsules/follow/"Input the nick"
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

### Get Capsules with Follower and Nick Name

- Get/ `./capsules/follow/:nickName`
  - Response list of capsules which a user of follower-list-members made

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample

```
http://address:port/capsules/follower/"Input the nick"
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

### Get Capsules with Follow For Follow and Nick Name

- Get/ `./capsules/f4f/:nickName`
  - Response list of capsules which friends made

- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample

```
http://address:port/capsules/f4f/"Input the nick"
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

### Post Capsules With Capsule_id, Nick_name

- Post/ `./capsules/id`
  - Response a capsule has this capsule_id including whether a user has Nick_name likes this capsule
    -
- Success Response : Header with Code 200
- Fail Response : Header with Code 404

#### Request Form Sample

```json
{
    capsule_id: __,
    nick_name: "__"
}
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
    like_flag: 1,
    content: [ ],
    members: [
            {
                nick_name : "nick16",
                status_key : 1
            },
            {
                nick_name : "nick17",
                status_key : 1
            },
            {
                nick_name : "nick18",
                status_key : 1
            },
            {
                nick_name : "nick14",
                status_key : 1
            }
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

### Post Key - LockedCapsules

- Post/ `./capsules/lock/key`
  - Use key to open LockedCapsule

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample

```json
{
	"nick_name" : "__",
    "capsule_id" : __
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