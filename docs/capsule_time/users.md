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
http://address:port/users/auth/
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
@Header(has SessionID)
http://address:port/users/logout/
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

### Put A User With Image no password

- Put/ `./users/image/nick`
  - Put a user with image no password

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample


```json
@multipart
{
    "pre_nick_name": "__",
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

### Put A User With Nick Name

- Put/ `./users/nick`
  - Put a user with nick name

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample


```json
{
    "pre_nick_name": "__",
    "new_nick_name": "__"
}
```

#### Response Form Sample

```json
{
    "success": "__"
}
```

### Put Image Of A User

- Put/ `./users/only/image`
  - Put image of a user

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample


```json
@multipart
{
    "nick_name": "__",
    "file": __
}
```

#### Response Form Sample

```json
{
    "success": "__"
}
```

### Put A User With Password

- Put/ `./users/nick`
  - Put a user with password

- Success Response : Header with Code 200
- Fail Response : Header with Code 404 
- Unauthorized user Response : Header with Code 401

#### Request Form Sample


```json
{
    "nick_name": "__",
    "password": "__"
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