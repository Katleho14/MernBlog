import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import Post from './models/post.model.js'; // Ensure this is your Sequelize model

dotenv.config();

// Initialize Sequelize with MySQL connection
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
  logging: false, // Set to true for debugging
});

const seedPosts = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Connected to MySQL for seeding!');

    // Sync model (Creates table if it doesn't exist)
    await Post.sync({ force: true }); // WARNING: This will drop and recreate the table

    // Sample post data
    const initialPosts = [
      {
        userId: 1, // Replace with a valid user ID
        title: 'The Joy of JavaScript',
        content: `JavaScript is a versatile language used for web development, game development, and more. Its asynchronous nature makes it ideal for handling complex tasks.

JavaScript's widespread adoption and large community make it a great choice for both beginners and experienced developers. With frameworks like React, Angular, and Vue.js, you can build complex and interactive web applications.`,
        image: 'https://cdn.prod.website-files.com/61dfc899a471632619dca9dd/66562b1aefef8f1db4fbc7ef_Screenshot%202024-05-28%20at%209.05.53%20PM.png',
        category: 'javascript',
        slug: 'the-joy-of-javascript',
      },
      {
        userId: 1,
        title: 'React: Building User Interfaces',
        content: `React is a popular JavaScript library for building user interfaces. Its component-based architecture and virtual DOM make it efficient and easy to use.

React's declarative approach simplifies the development process, allowing you to focus on the UI logic rather than the underlying DOM manipulations. With React, you can create reusable components that make your code more maintainable and scalable.`,
        image: 'https://blog.logrocket.com/wp-content/uploads/2023/10/complete-guide-react-refs.png',
        category: 'reactjs',
        slug: 'react-building-user-interfaces',
      },
      {
        userId: 1,
        title: 'Next.js: The React Framework',
        content: `Next.js is a React framework that enables features like server-side rendering and static site generation. It is great for building performant web applications.

Next.js simplifies the process of building production-ready React applications. It provides features like automatic code splitting, optimized images, and easy deployment, making it a great choice for building modern web applications.`,
        image: 'https://cdn.sanity.io/images/vftxng62/production/2700b35af7f83bfd8237cdb32dc1cd873469d878-877x368.png?w=768&auto=format',
        category: 'nextjs',
        slug: 'nextjs-the-react-framework',
      },
      {
        userId: 1,
        title: 'Mastering MySQL',
        content: `MySQL is a powerful, open-source relational database management system (RDBMS). It is widely used in web applications and supports structured data storage.

MySQL's relational nature makes it ideal for structured data and complex queries. Its reliability and speed make it a preferred choice for web applications, data warehousing, and analytics.`,
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/MySQL_textlogo.svg',
        category: 'mysql',
        slug: 'mastering-mysql',
      },
    ];

    // Insert posts into database
    await Post.bulkCreate(initialPosts);
    console.log('Database seeded successfully!');

    // Close connection
    await sequelize.close();
    console.log('MySQL connection closed.');
  } catch (err) {
    console.error('Error seeding the database:', err);
  }
};

// Run seeding function
seedPosts();
