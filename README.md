# Tagged Image Service

Service for uploading images, applying tags to images, searching images by tags and upload date, and downloading images.

## Running locally

Rename the file '.env.example' to be just '.env'

Start the service with:

```
./scripts/start.sh
```

Stop the service with:

```
./scripts/stop.sh
```

## Developing locally

### Requirements

1. NodeJS
1. A database client
1. Mac OS, Linux, or WSL environment on Windows machine.

### Running local application against dockerized db

Start the database container with

```
docker-compose up -d db
```

Install application with

```
npm i
```

If there are any outstanding migrations (note that migrations will be run if the 'Running Locally' steps above have been followed), they can be run with

```
npm run migrate
```

Run the application with

```
npm run start
```

## Testing Application

Run unit tests by running

```
npm run test
```

Test endpoints by using a REST client such as Insomnia: https://insomnia.rest/

An insomnia collection is included in this repo as tagged-image-service-insomnia-collection.json . This can be imported into insomnia to make calls against the running API immediately.

## Dockerisation

Build the docker image with

```
docker build . -t chrisjolly25/tagged-image-service --no-cache

```

## Design Considerations

### API

Tag format
I considered treating tags as simple strings. That raised questions about what tags would be equal (issues of case, separators, etc). It would also raise issues if two tags had the same string representation, but represented different concepts (i.e, homographs. Does a tag of 'cervical' refer to the neck, as in cervical vertebra, or the lowest segment of the uterus, the uterine cervix). Storing tags with both ids and text would allow tags to be disambiguated. Some additional business logic could then be added to reconcile tags when duplicate tags are created that do represent the same concept, or validate tag creation to prevent this.

Image format
Image creation is done by POSTing to the /images endpoint. Setting tags is done by PATCHing the image model, including its tags array property, to the /images/:id endpoint.
Splitting these responsibilities was done to simplify the implementation and consumption of the API. If it was ever required to set the tags at the same time the image was created, or to modify the image in a patch, the endpoints could be updated to support this.

A weakness of idempotently setting the tags in a patch operation is that changes can be clobbered during concurrent modification. To address this I would implement optimistic locking with versioning of the model, and reject patches that are done on stale models.

### Design approach

I first defined the models I was going to use, their relationships, and the REST methods to manipulate and fetch them

```json
"image": {
    "id": 1,
    "filename": "test.jpg",
    "tags": [
        {
            "id": 1,
            "text": "test_tag"
        }
    ],
    "createdAt": "2022-08-07T04:50:40.000Z",
    "modifiedAt": "2022-08-07T04:50:40.000Z"
}

"tag": {
    "id": 1,
    "text": "test_tag"
}
```

Tag operations: Create tag, Get tags
Image operations: Create image, Get Image file. Get Image model. Update image to set tags. Search images.

I created an Express app for expediency and because it is widely used.

I've previously used templated mysql queries when making database requests from a nodejs app. I elected to use TypeORM in this instance mainly to take the opportunity to learn it.

I used a naive api-key based authentication. This would not be suitable for a production app. If I was going to use an API key to secure the API, I would have something like AWS Api Gateway deal with api key generation and authentication. The API key here is stored in a .env. This is also unsuitable for a real app, where secrets would be stored in a Secret Manager, or provided by the pipeline. I spiked on adding OAuth2 to the application, but would need longer to get this working, and understood to a level I was comfortable with.

## Deployment

### Environment

-   This application could be deployed containerized, and deployed to AWS. A basic stack would include an API gateway, a load balancer, an S3 bucket to store images, and two instances of the application running as ECS tasks to provide redundancy. Infrastructure would be defined via CDK to allow source control.
-   The application could be made serverless by replacing the routes and controllers with lambda functions. This would speed deployment times and simplify scaling, at the expense of some lock in to AWS infrastructure.
-   Reliability could be further improved by decoupling request handling and application services via an SQS queue. Queues have high uptime, and errors fall into a dead letter queue for debugging and re-processing.

### Subsequent Deployments

All deployments would be carried out by a build pipeline (for example, Bitbucket pipelines, Bamboo CI, Github Actions, etc).
Deployments would be triggered by a merge to a staging branch or master branch, for the staging and production environments respectively.

### Avoid downtime during deployments

With containers running in multiple tasks behind a load balancer, the outdated tasks will not be stopped until the new containers are deployed and healthy.

### Immutable infrastructure

For an AWS deployment, infrastructure would be declared in an AWS CDK file. For local setups, docker-compose and start scripts can declare networked, multi-container infrastructures.

### Updates from previous submission

Since the previous submission, the application has been refactored to

-   Use the NestJS framework to support inversion of control with dependency injection
-   Per user login mechanism, with subsequent jwt authentication of requests
-   Auditing of write operations

### What I would have liked to add

-   Improve image storage and handling
    -   Store the images on the cloud
    -   Store the images with a unique key, or with a system generated filename, to allow images with colliding filenames to be uploaded
    -   Anonymise image data. As these image are likely to be PHI, I would want to make some changes
    -   Scrub any metadata from the image
    -   If there is any chance this service will surface image models to an end user, we're better using uuids for the id. ids are vulnerable to fishing for hits, if you know the approximate time an image was submitted.
-   Improve API
    -   Implement json-api across all responses. json-api has some overhead in formatting responses to fit the standard, but simplifies both API design and consumption (by both developers and systems) by following a prescriptive, machine readable standard.
    -   Standardise error responses. Currently all errors thrown are returned directly to the client. Errors should be intercepted before response, and returned in a format that includes the correct error code, a useful message, and detail directing to the erroneous field if applicable. It would be good to extend Error with custom Errors, then catch those at the top level, map them to an error code, and respond. That will unify error responses, and decouple Error responding (a communication concern) from Error throwing (an application logic/implementation concern)
    -   Validate requests, return useful errors.
-   Expand unit test and end to end test coverage. For the purposes of this time boxed exercise, I did not attempt anything like complete code coverage. A production app would have complete code coverage, and ideally build steps to fail a build if test coverage dropped below an agreed threshold.
-   Authentication
    -   Dockerisation was done late in development, and is not well integrated with local development. A different app-data-source variable is required to connect when the app is running on a laptop vs in docker. Local development should be done by mounting src directly in the container, to have parity between the setups.
