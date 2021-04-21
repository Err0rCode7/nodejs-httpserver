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