# follow
## follow a user
### Allowed method: POST, DELETE
http://127.0.0.1:8000/users/4/follow/5

POST: user id 4 follow user id 5

DELETE: user id 4 unfollow user id 5

**POST return**

```json
{
    "error": "Already exist"
}
//or
{
    "id": 10,
    "status": null,
    "follower": 4,
    "following": 5
}
```

**DELETE return**

```json
{} with status 200 ok
//or 
{
    "httpCode": "404",
    "errorMsg": "Not Found"
}
```

## GET http://127.0.0.1:8000/users/8/followers

```json
{
    "user": {
        "email": "ee@gmail.com",
        "username": "ee",
        "name": "ee_name",
        "phone_num": 12335678,
        "funds": 1000.0,
        "member_type": "unknown member type"
    },
    "followers": []
}
```
## GET http://127.0.0.1:8000/users/8/followings

```json
{
    "user": {
        "email": "ee@gmail.com",
        "username": "ee",
        "name": "ee_name",
        "phone_num": 12335678,
        "funds": 1000.0,
        "member_type": "unknown member type"
    },
    "followings": [ 
        {
            "email": "bb@gmail.com",
            "username": "bb",
            "name": "bb_name",
            "phone_num": 12345679,
            "funds": 1000.0,
            "member_type": "unknown member type"
        }
    ]
}
```
## PUT http://127.0.0.1:8000/users/reset_password

Invalid username or email:   return status.HTTP_404_NOT_FOUND

Successful change:   return status=status.HTTP_200_OK

Invalid key in json body: return status=status.HTTP_400_BAD_REQUEST

Other http methods: status.HTTP_405_METHOD_NOT_ALLOWED

```json
{
    "username":"abc",
    "email":"123@gmail.com",
    "new_password":"123"
}
```