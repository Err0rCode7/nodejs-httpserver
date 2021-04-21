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