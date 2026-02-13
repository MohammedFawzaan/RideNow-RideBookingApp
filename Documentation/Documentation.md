# RideHub Application Documentation

## 1. System Overview
RideHub is a web-based transportation platform designed to facilitate on-demand connections between passengers seeking transportation and independent drivers (referred to as Captains). The application provides a comprehensive interface for booking, tracking, and managing rides in real-time, ensuring a structured and accountable service flow.

## 2. User Roles
The platform allows for two distinct user roles, each with specific interfaces and functionalities:

*   **Passenger**: The end-user who requests transportation services.
*   **Captain**: The service provider (driver) who accepts and fulfills ride requests.

## 3. Core Functionalities

### 3.1. Account Management
*   **Registration**: Both Passengers and Captains must register to use the platform.
    *   **Passengers** provide basic personal identity information.
    *   **Captains** provide vehicle details, including license plate number, vehicle capacity, and type (Car, Auto, or Moto), to ensure service categorization.
*   **Authentication**: Secure access is provided via standard email/password credentials or through Google Single Sign-On (SSO).

### 3.2. Booking Workflow (Passenger)
*   **Location Selection**: Users utilize an integrated mapping interface to specify precise pickup and drop-off coordinates. The system supports address search and auto-completion.
*   **Fare Estimation**: Before a booking is confirmed, the system calculates and displays an upfront fare. This calculation is based on the distance between points and the specific vehicle category selected.
*   **Vehicle Categories**: Passengers can select from available vehicle types:
    *   **Moto**: Single-passenger motorbike service.
    *   **Auto**: Three-wheeled vehicle service for small groups.
    *   **Car**: Standard sedan service for maximum comfort and capacity.

### 3.3. Ride Management (Captain)
*   **Request Dashboard**: Captains have access to a real-time dashboard that displays incoming ride requests.
*   **Trip Details**: Each request presents critical information, including the distance to the pickup point, the total trip distance, and the earning amount.
*   **Acceptance Logic**: Captains retain full autonomy to accept or decline ride requests based on their availability and location.

### 3.4. Ride Execution & Security
*   **One-Time Password (OTP) Verification**: To prevent fraud and ensure passenger safety, the system generates a unique 4-digit OTP for the passenger upon booking. The ride cannot officially commence until the Passenger provides this code to the Captain, and the Captain successfully enters it into their application.
*   **Real-Time Tracking**: From the moment a captain accepts a ride, the passenger can track the vehicle's location on the map in real-time.
*   **Navigation Assistance**: The application provides visual route guidance to help Captains navigate efficiently to the pickup location and the final destination.

### 3.5. Payment and Completion
*   **Trip Termination**: Upon reaching the destination, the Captain marks the ride as complete within the application.
*   **Payment Settlement**: The system generates a final fare summary. Currently, the platform supports cash settlement between the Passenger and the Captain.

## 4. Operational Flow
1.  **Request**: Passenger enters location details, views fare estimates, and confirms a booking.
2.  **Dispatch**: The system broadcasts the request to available Captains in the vicinity.
3.  **Acceptance**: A Captain accepts the request and proceeds to the coordinates.
4.  **Verification**: Captain arrives; Passenger shares the OTP; Captain validates the OTP to start the timer.
5.  **Transit**: The ride is in progress with live tracking enabled.
6.  **Conclusion**: Captain completes the ride; fare is collected.
