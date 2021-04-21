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