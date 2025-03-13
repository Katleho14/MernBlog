import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Post from './models/post.model.js'; // Import your Post model

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB for seeding!');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const seedPosts = async () => {
  try {
    // Delete existing posts (optional, but useful for development)
    await Post.deleteMany({});

    // Sample post data
    const initialPosts = [
      {
        userId: '6623b11a929a9c671496079a', // Replace with a valid user ID
        title: 'The Joy of JavaScript',
        content: `JavaScript is a versatile language used for web development, game development, and more. Its asynchronous nature makes it ideal for handling complex tasks.

        JavaScript's widespread adoption and large community make it a great choice for both beginners and experienced developers. With frameworks like React, Angular, and Vue.js, you can build complex and interactive web applications.`,
        image: 'https://cdn.prod.website-files.com/61dfc899a471632619dca9dd/66562b1aefef8f1db4fbc7ef_Screenshot%202024-05-28%20at%209.05.53%20PM.png', // Placeholder image
        category: 'javascript',
        slug: 'the-joy-of-javascript',
      },
      {
        userId: '6623b11a929a9c671496079a', // Replace with a valid user ID
        title: 'React: Building User Interfaces',
        content: `React is a popular JavaScript library for building user interfaces. Its component-based architecture and virtual DOM make it efficient and easy to use.

        React's declarative approach simplifies the development process, allowing you to focus on the UI logic rather than the underlying DOM manipulations. With React, you can create reusable components that make your code more maintainable and scalable.`,
        image: 'https://blog.logrocket.com/wp-content/uploads/2023/10/complete-guide-react-refs.png',
        category: 'reactjs',
        slug: 'react-building-user-interfaces',
      },
      {
        userId: '6623b11a929a9c671496079a', // Replace with a valid user ID
        title: 'Next.js: The React Framework',
        content: `Next.js is a React framework that enables features like server-side rendering and static site generation. It is great for building performant web applications.

        Next.js simplifies the process of building production-ready React applications. It provides features like automatic code splitting, optimized images, and easy deployment, making it a great choice for building modern web applications.`,
        image: 'https://cdn.sanity.io/images/vftxng62/production/2700b35af7f83bfd8237cdb32dc1cd873469d878-877x368.png?w=768&auto=format', // Placeholder image
        category: 'nextjs',
        slug: 'nextjs-the-react-framework',
      },
      {
        userId: '6623b11a929a9c671496079a', // Replace with a valid user ID
        title: 'Mastering MongoDB',
        content: `MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. It is scalable and well-suited for modern applications.

        MongoDB's document-oriented approach makes it easy to store and retrieve data. Its scalability and flexibility make it a great choice for handling large amounts of data in modern applications.`,
        image: 'https://cdn.hackersandslackers.com/2019/07/mongodbcloud.jpg', // Placeholder image
        category: 'mongodb',
        slug: 'mastering-mongodb',
      },
      {
        userId: '6623b11a929a9c671496079a', // Replace with a valid user ID
        title: 'Node.js: The Server-Side JavaScript',
        content: `Node.js allows you to run JavaScript on the server. It is event-driven and non-blocking, making it efficient for handling real-time applications.

        Node.js's non-blocking I/O model makes it highly efficient for handling concurrent requests. Its large ecosystem of modules and frameworks makes it a great choice for building scalable and performant server-side applications.`,
        image: 'https://images.ctfassets.net/aq13lwl6616q/7cS8gBoWulxkWNWEm0FspJ/c7eb42dd82e27279307f8b9fc9b136fa/nodejs_cover_photo_smaller_size.png', // Placeholder image
        category: 'nodejs',
        slug: 'nodejs-the-server-side-javascript',
      },
      {
        userId: '6623b11a929a9c671496079a', // Replace with a valid user ID
        title: 'CSS: Styling the Web',
        content: `CSS is essential for styling web pages. It allows you to control the layout, colors, fonts, and other visual aspects of your website.

        CSS's cascading nature allows you to easily manage styles across your website. With CSS preprocessors like Sass and Less, you can write more maintainable and scalable CSS code.`,
        image: 'https://miro.medium.com/v2/resize:fit:5120/1*l4xICbIIYlz1OTymWCoUTw.jpeg', // Placeholder image
        category: 'css',
        slug: 'css-styling-the-web',
      },
      {
        userId: '6623b11a929a9c671496079a', // Replace with a valid user ID
        title: 'HTML: Structuring Web Content',
        content: `HTML provides the structure for web content. It uses elements and tags to define headings, paragraphs, images, links, and other elements.

        HTML's semantic elements make it easy to create accessible and well-structured web content. With HTML5, you can create rich and interactive web experiences.`,
        image: 'data:image/png;base64,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', // Placeholder image
        category: 'html',
        slug: 'html-structuring-web-content',
      },
      {
        userId: '6623b11a929a9c671496079a', // Replace with a valid user ID
        title: 'The Power of APIs',
        content: `APIs (Application Programming Interfaces) allow different software systems to communicate with each other. They are essential for building modern, interconnected applications.

        APIs enable you to access data and functionality from other applications, allowing you to create rich and integrated experiences. With RESTful APIs, you can easily build scalable and maintainable web services.`,
        image: 'https://blog.postman.com/wp-content/uploads/2021/03/APIs-in-Postman-e1616786230943.png', // Placeholder image
        category: 'api',
        slug: 'the-power-of-apis',
      },
      {
        userId: '6623b11a929a9c671496079a', // Replace with a valid user ID
        title: 'Web Security Best Practices',
        content: `Web security is crucial for protecting your website and users from threats. Implementing best practices like HTTPS, input validation, and proper authentication is essential.

        By following web security best practices, you can protect your website and users from common threats like XSS, SQL injection, and CSRF. Regularly updating your software and using strong passwords are also important for maintaining a secure website.`,
        image: 'https://cdn.prod.website-files.com/5fbc3fcb12d95f9606608540/615dd64be35b6118c0d70b56_y5-XaSfVM6c7TyQHhvdd8I0Ijuv1CzHaZY6Lw9GyU0o5eFVQu8meDjmioUlzBu7jq6mHs__aG_eg_QtvYlzlx6nZ0xix5cNtdS8p_uy7iqihRjjaf7jW7V5qwLz2wNbCPDjEzpgB%3Ds0.png', // Placeholder image
        category: 'security',
        slug: 'web-security-best-practices',
      },
    ];

    // Create the new posts
    await Post.insertMany(initialPosts);

    console.log('Successfully seeded the database!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    mongoose.disconnect(); // Close the connection after seeding
  }
};

seedPosts();