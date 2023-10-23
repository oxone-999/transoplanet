# Google Shopping Product Scraper

### Developer : Anuj Verma
### Institute : IIT Kharagpur

## Project Description
The Google Shopping Product Scraper is a web application that allows users to search for products using keywords. The application scrapes Google Shopping search results and displays product information, including the product name, price, and an image. Additionally, users can listen to the product names in speech.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  
## Prerequisites
Before you begin, make sure you have the following requirements in place:

- **Node.js**: You need Node.js installed on your machine. You can download it from [https://nodejs.org/](https://nodejs.org/).

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/oxone-999/transoplanet.git
   ```
2. **Change Directory**:
   ```bash
   cd google-shopping-scraper
   ```
3. **Install Dependencies**:
   ```bash
   # Install server dependencies
   cd Server
   npm install

   # Install client dependencies
   cd client
   npm install
   ```
4. **Set Environment Variables**:
   - **Create an `.env` file in the server directory and add the following environment variables**:
   ```bash
   PORT=5001
   ```
5. **Start client**:
   ```bash
   npm run dev
   ```
6. **Start Backend**:
   ```bash
   node server.js
   ```
