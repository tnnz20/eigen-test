# Eigen Back end Test

## How to run in local

- init project using `pnpm init`
- copy this command

    ```bash
    cp .env.example .env
    ```

- compile typescript file using `pnpm tsc` this command
- start app using `pnpm start`

## Entities

- Member
- Book
- Borrow
- Penalty

## Use Case

- Members can borrow books with conditions
    - [x]  Members may not borrow more than 2 books
    - [x]  Borrowed books are not borrowed by other members
    - [x]  Member is currently not being penalized
- Member returns the book with conditions
    - [x]  The returned book is a book that the member has borrowed
    - [x]  If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days
- Check the book
    - [x]  Shows all existing books and quantities
    - [x]  Books that are being borrowed are not counted
- Member check
    - [x]  Shows all existing members
    - [ ]  The number of books being borrowed by each member

## Requirements

- [x]  it should be use any framework, but prefered [NestJS](https://nestjs.com/) Framework Or [ExpressJS](https://expressjs.com/)
- [ ]  it should be use Swagger as API Documentation
- [x]  it should be use Database (SQL/NoSQL)
- [x]  it should be open sourced on your github repo

## Extras

- [x]  Implement [DDD Pattern]([https://khalilstemmler.com/articles/categories/domain-driven-design/](https://khalilstemmler.com/articles/categories/domain-driven-design/))
- [x]  Implement Unit Testing


## ALGORITMA

Link folder [here](https://github.com/tnnz20/eigen-test/tree/main/algoritma)