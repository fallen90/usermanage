## Authentication [/api/authenticate]


### Login `POST`
`isInfoIncluded` is optional, but defaults to `false`

##### Request **(application/json)**

Property | Description | Type | Required
---------|-------------|------|--------
**username** | user name | `String` | Yes
**password** | user password | `String` | Yes
**mac_address** | device wifi mac_address | `String` | Yes
**isInfoIncluded** | include user info on response | `Boolean` | No _defaults to_ `false`

```json
        {
            "username" : "xxxx",
            "password" : "password",
            "mac_address" : "00:00:00:00:00:00",
            "isInfoIncluded" : false
        }
```
#####  Response `200` **(application/json)**
Property | Description | Type 
---------|-------------|------
**success** | success? | `Boolean` 
**message** | not that significant | `Boolean`
**accesstoken** | your key | `Boolean`
**expiresIn** | unix time when the token will expire | `Integer`
**currentTime** | Server current time | `Integer`

```json
        {
          "success": true,
          "message": "Success!",
          "accesstoken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7Imxhc3RfbG9naW4iOiJpbml0IiwiY3JlYXRlZF9hdCI6ImluaXQiLCJfX3YiOiJpbml0IiwiYWRtaW4iOiJpbml0IiwicGFzc3dvcmQiOiJpbml0IiwidXNlcm5hbWUiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJsYXN0X2xvZ2luIjp0cnVlLCJjcmVhdGVkX2F0Ijp0cnVlLCJhZG1pbiI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsInVzZXJuYW1lIjp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH19LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsibGFzdF9sb2dpbiI6IjIwMTYtMDUtMjZUMTM6Mjc6NDUuNzIzWiIsImNyZWF0ZWRfYXQiOiIyMDE2LTA1LTI2VDEzOjI3OjQ1LjcyM1oiLCJfX3YiOjAsImFkbWluIjp0cnVlLCJwYXNzd29yZCI6InBhc3N3b3JkIiwidXNlcm5hbWUiOiJ4eHh4IiwiX2lkIjoiNTc0NmY5ZDE0YTNjZTg3ODIzNjc4ZjE4In0sIl9wcmVzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltudWxsLG51bGxdfSwiX3Bvc3RzIjp7IiRfX29yaWdpbmFsX3NhdmUiOltdfSwiaWF0IjoxNDY0Mzc3ODEzLCJleHAiOjE0NjQzNzk2MTN9.Mb7M-S9Nn2R3Rs3OoahmsZB8SkZLIdGiqlpbz0HALco",
          "expiresIn": 1464379613,
          "currentTime": 1464377813
        }
```

## Analytics [/api/analytics]
send analytical data for statistics

### Send `POST`

+ Request (application/json)
```json
        {
            "mac_address" : "00:00:00:00:00:00",
            "filename" : "sample_video.wmv"
        }
```
        
+ Response 200 (application/json)
```json        
        {
            "success" : true
        }
```
+ Response 403 (application/json)
```json
        {
            "success" : false,
            "message" : "device not registered"
        }
```
+ Response 403 (application/json)
```json
        {
            "success" : false,
            "message" : "token expired"
        }
```
+ Response 403 (application/json)
```json
        {
            "success" : false,
            "message" : "token invalid or malformed"
        }
```
+ Response 500 (application/json)
```json
        {
            "message" : "application error"
        }
```

TODO
----
- [ ] User info update
