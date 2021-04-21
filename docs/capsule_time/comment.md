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
        comment_id: 2,
        nick_name: "nick11",
        comment: "Test1",
        date_created: "2020-07-15T11:49:04.000Z",
        date_updated: "2020-07-15T11:49:04.000Z",
        user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg",
        replies: [
            {
                reply_id: 1,
                nick_name: "nick11",
                comment: "Test5",
                date_created: "2020-07-15T11:49:39.000Z",
                date_updated: "2020-07-15T11:49:39.000Z",
                user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg"
            },
            {
                reply_id: 2,
                nick_name: "nick11",
                comment: "Test6",
                date_created: "2020-07-15T11:49:43.000Z",
                date_updated: "2020-07-15T11:49:43.000Z",
                user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg"
            },
            {
                reply_id: 3,
                nick_name: "nick11",
                comment: "Test7",
                date_created: "2020-07-15T11:49:46.000Z",
                date_updated: "2020-07-15T11:49:46.000Z",
                user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg"
            },
            {
                reply_id: 4,
                nick_name: "nick12",
                comment: "Test10",
                date_created: "2020-07-15T11:50:10.000Z",
                date_updated: "2020-07-15T11:50:10.000Z",
                user_image_url: "http://211.248.58.81:7070/contents/1592162405325.jpg"
            },
            {
                reply_id: 5,
                nick_name: "nick11",
                comment: "Test8",
                date_created: "2020-07-15T11:49:52.000Z",
                date_updated: "2020-07-15T11:49:52.000Z",
                user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg"
            },
            {
                reply_id: 6,
                nick_name: "nick13",
                comment: "Test10",
                date_created: "2020-07-15T11:50:16.000Z",
                date_updated: "2020-07-15T11:50:16.000Z",
                user_image_url: "http://211.248.58.81:7070/contents/1592162490258.jpg"
            }
        ]
    },
    {
        comment_id: 3,
        nick_name: "nick11",
        comment: "Test2",
        date_created: "2020-07-15T11:49:06.000Z",
        date_updated: "2020-07-15T11:49:06.000Z",
        user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg",
        replies: [ ]
    },
    {
        comment_id: 4,
        nick_name: "nick11",
        comment: "Test3",
        date_created: "2020-07-15T11:49:09.000Z",
        date_updated: "2020-07-15T11:49:09.000Z",
        user_image_url: "http://211.248.58.81:7070/contents/1592162266492.jpg",
        replies: [
            {
                reply_id: 7,
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
    "comment": ""
}
```

- case 2 (Child Comment : reply)

```json
{
    "capsule_id" : __,
    "nick_name" : "__",
    "comment": "",
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
http://address:port/comment/reply/"Input the Reply ID"
```

#### Response Form Sample

```json
{
   "success": true
}
```