# nodejs-httpserver
Develope http-streaming-server

## To-do
---
- capsule rest api
    - comment rest api
        -commented comment
    - tag

- user rest api
    - +follwer
    - +follow

- like

- followers

- anything...

## Completed - 1
(2020/05/18 ~ 2020/05/27)

---

- users 
    - Get/ `./users/`
    - Response JSON about all of users 

        ![image](https://user-images.githubusercontent.com/48249549/83009436-bb191600-a051-11ea-90bf-ddceab46c525.png)

    - Get/ `./users/:id/` 
    - Response JSON about a user

        ![image](https://user-images.githubusercontent.com/48249549/83009360-991f9380-a051-11ea-96f6-38c142a5fd7e.png)

    - Post/ `./users/` 
    - Register a user ( Inster a user ) 

        ![image](https://user-images.githubusercontent.com/48249549/83010262-f23bf700-a052-11ea-9d1a-b228d7dba562.png)

    - Put/ `./users/` 
    - Update data of a user 

        ![image](https://user-images.githubusercontent.com/48249549/83010799-ca00c800-a053-11ea-9157-bc7a4133978b.png)

    - Delete/ `./users/` 
    - Delete a user 

        ![image](https://user-images.githubusercontent.com/48249549/83010614-7d1cf180-a053-11ea-9708-f793fbabf7d1.png) 

        ![image](https://user-images.githubusercontent.com/48249549/83009810-472b3d80-a052-11ea-8b82-b0fa405eecbf.png)
    ---
    - Post/ `./users/auth/` 
    - Check authorization(login) of a user 
    
- contents ( image or video )

    - Get/ `./contents/:contentId` 
    - Response content with content ID 

        ![image](https://user-images.githubusercontent.com/48249549/83011078-4693a680-a054-11ea-9e0a-2ee000d7607d.png)

    - Get/ `contents/capsule-id/:capsuleId` 
    - Response contentID 
    
    - Post/ `./contents/` 
    - Upload a content or a nubmer of contents 
    - with multipart/form-data

        ![image](https://user-images.githubusercontent.com/48249549/83015039-c58bdd80-a05a-11ea-9604-dcc080c1c159.png)

    - Put/ `./contents/`    Dont need 
    - Dont develope

    - Delete/ `./contents/contentId` 
    - Delete a content 


## Completed - 2
( 2020/05/28 ~ 2020/06/03 )

---
- capsules 

    - Get/ `./capsules/`
    - Response JSON about all of Capsules 

        ![image](https://user-images.githubusercontent.com/48249549/83625774-72bca380-a5cf-11ea-9bcb-2b38580bf536.png)

    - Get/ `./capsules/capsuleID` 
    - Response JSON about a Capsule

        ![image](https://user-images.githubusercontent.com/48249549/83626030-d777fe00-a5cf-11ea-88d6-28845bdd37cc.png)

    - Get/ `./capsules/location?lat=__&lng=__`
    - Response Json about capsules within 5KM

        ![image](https://user-images.githubusercontent.com/48249549/83626287-2887f200-a5d0-11ea-856f-7378e92d3c9c.png)

    - Get/ `./capsules/user?user_id=__`
    - Response Json about capsules of a user

        ![image](https://user-images.githubusercontent.com/48249549/83626440-6258f880-a5d0-11ea-997c-9f2baf23bf81.png)

    - Post/ `./capsules`
    - Post a capsule temporarily 

        ![image](https://user-images.githubusercontent.com/48249549/83626561-903e3d00-a5d0-11ea-98de-3c1bc42f89b1.png)

    - Put/ `./capsules`
    - Complete a posted capsule 
    - with multipart/form-data

        ![image](https://user-images.githubusercontent.com/48249549/83626849-0347b380-a5d1-11ea-820a-40124cd62c23.png)

        - 결과

        ![image](https://user-images.githubusercontent.com/48249549/83627094-65a0b400-a5d1-11ea-8b9c-df9dd6d388cd.png)


    - Delete/ `./capsules`
    - Delete all about a capsule

        ![image](https://user-images.githubusercontent.com/48249549/83627209-8a952700-a5d1-11ea-9916-d5f56fcf0258.png)

        - 결과

        ![image](https://user-images.githubusercontent.com/48249549/83627271-9d0f6080-a5d1-11ea-827e-0ab18e894249.png)

