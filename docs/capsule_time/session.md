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

