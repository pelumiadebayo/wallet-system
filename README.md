Cloning and Running the Project
-------------------------------

### Prerequisites

*   Node.js (version 16 or above)
    
*   npm (version 10 or above)
    
*   MongoDB (preferably running in replica set mode)
    
*   Git

### Steps to Clone and Run

1.  **Clone the Repository**

    > `git clone https://github.com/pelumiadebayo/wallet-system.git 
    > cd your-repo-name`
    
2.  **Install Dependencies**

    > `npm install`
 
3.  **Set Up Environment Variables**
    
    Create a `.env` file in the root directory and add the following variables:

    > MONGODB_URI=mongodb://localhost:27017/wallet-system
    > JWT_SECRET=your_jwt_secret
    > PORT=3000
   
4.  **Run the Application**

    > `npm start`
    
5.  You can test the API endpoints using Postman. The Postman collection can be found [here](https://github.com/).
    

Technical Decisions
-------------------

### Database

*   **MongoDB**: Used for its schema-less nature, scalability, and support for transactions, especially in replica set mode to handle race conditions and maintain data consistency.
    

### API and Framework

*   **Express.js**: Used for handling routing and middleware. It’s a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
    
*   **Mongoose**: Used for MongoDB object modeling. It provides a schema-based solution to model application data, offering built-in typecasting, validation, query building, and business logic hooks.
    

### Authentication and Authorization

*   **JWT (JSON Web Token)**: Used for securing API endpoints. It ensures that only authenticated users can perform transactions.
    

### Guards against financial exploitations:Race Conditions and Deadlocks

*   **Optimistic Locking**: Implemented using Mongoose’s versioning feature. This prevents race conditions by ensuring that updates to documents are based on their version.
    
*   **Transaction Management**: Using MongoDB sessions to perform atomic operations and ensure data consistency.
    
*   **Timeout Mechanism**: For handling deadlocks and ensuring operations complete successfully in the event of concurrent transaction when two or more operations wait indefinitely for each other to release resources
    

### Error Handling

*   **Centralized Error Handling Middleware**: Ensures consistent error responses and reduces code duplication.
    
*   **Retry Mechanism**: For handling transient errors and ensuring operations complete successfully in the event of temporary failures.
    

### Security

*   **Input Validation**: Using express-validator to validate and sanitize incoming requests.
    
*   **Sensitive Data Encryption**: Storing sensitive fields like passwords in an encrypted format using bcrypt.
    

### Scalability and Maintainability

*   **Modular Architecture**: Separating different concerns into modules (controllers, services, models, and middlewares) to enhance code maintainability and scalability.