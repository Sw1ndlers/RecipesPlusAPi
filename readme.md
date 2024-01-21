# Backend for [RecipesPlus](https://recipesplus.live/)

## Information

Recipes are sourced from AllRecipes, planning on implementing more soon  
User information is stored on mongodb and Express is used for routing  
Frontend can be found at [RecipesPlusFrontend](https://github.com/Sw1ndlers/RecipesPlusFrontend)

## Running the api

### 1. Clone the repository
```
git clone https://github.com/Sw1ndlers/GptApi
```

### 2. Install Dependencies
```
npm install
```

### 3. Rename .env.example to .env and fill in values

### 4. Run the server
```
npm run dev
```

<br>

## General Routes

### Search for recipes
`GET /search/?q=QUERY`
```
/search/?q=chicken
```


### Get recipe information
`GET /recipe/:id/:rawTitle`
```
/recipe/45957/chicken-makhani-indian-butter-chicken
```

<br>

## Auth Routes

### Create an account
Returns session token

`POST /auth/register`
```json
"Body": {
    "username": "username",
    "password": "password"
}
```

### Login to an account
Returns session token

`POST /auth/login`
```json
"Body": {
    "username": "username",
    "password": "password"
}
```

### Send verification code

`POST /auth/verifyCode?code=CODE`
```json
{
    "Authorization": "SESSION_TOKEN"
}
```

<br>

## User Routes

### Get user information

`GET /user/getInfo`
```json
{
    "Authorization": "SESSION_TOKEN"
}
```
