// postModel.js
import pool from './database.js'; // Adjust the path if your database.js is elsewhere
export async function createPostsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      title VARCHAR(255) NOT NULL UNIQUE,
      content TEXT NOT NULL,
      image VARCHAR(255) DEFAULT 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
      category VARCHAR(255) DEFAULT 'uncategorized',
      slug VARCHAR(255) NOT NULL UNIQUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log('✅ Posts table created or already exists.');
  } catch (error) {
    console.error('❌ Error creating posts table:', error);
    throw error;
  }
}

/**
 * Inserts a new post into the 'posts' table.
 * @param {Object} postData - The data for the new post.
 * @param {number} postData.userId
 * @param {string} postData.title
 * @param {string} postData.content
 * @param {string} [postData.image]
 * @param {string} [postData.category]
 * @param {string} postData.slug
 * @returns {Promise<Object>} The newly created post object, including its ID.
 */
export async function createPost(postData) {
  // Destructure with default values for safety, matching your Sequelize defaults
  const {
    userId,
    title,
    content,
    image = "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    category = "uncategorized",
    slug
  } = postData;

  const query = `
    INSERT INTO posts (userId, title, content, image, category, slug)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    // Using pool.execute for prepared statements, which is crucial for security (prevents SQL injection)
    const [result] = await pool.execute(query, [userId, title, content, image, category, slug]);
    // After insertion, fetch the complete new post, including its auto-generated ID and timestamps
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [result.insertId]);
    return rows[0];
  } catch (error) {
    console.error('❌ Error creating post:', error);
    // You might want to check for unique constraint errors here (e.g., for title or slug)
    throw error;
  }
}

/**
 * Retrieves all posts from the 'posts' table.
 * @returns {Promise<Array<Object>>} An array of post objects.
 */
export async function getAllPosts() {
  const query = 'SELECT * FROM posts ORDER BY createdAt DESC'; // Order by creation date
  try {
    const [rows] = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('❌ Error fetching all posts:', error);
    throw error;
  }
}

/**
 * Retrieves a single post by its unique slug.
 * @param {string} slug - The unique slug of the post.
 * @returns {Promise<Object|undefined>} The post object if found, otherwise undefined.
 */
export async function getPostBySlug(slug) {
  const query = 'SELECT * FROM posts WHERE slug = ?';
  try {
    const [rows] = await pool.execute(query, [slug]);
    return rows[0]; // Return the first (and should be only) matching row
  } catch (error) {
    console.error('❌ Error fetching post by slug:', error);
    throw error;
  }
}

/**
 * Updates an existing post by its ID.
 * @param {number} id - The ID of the post to update.
 * @param {Object} updateData - An object containing the fields to update (e.g., { title: 'New Title' }).
 * @returns {Promise<Object|undefined>} The updated post object if found and updated, otherwise undefined.
 */
export async function updatePost(id, updateData) {
  const fields = [];
  const values = [];

  // Dynamically build the SET clause for the SQL query
  for (const key in updateData) {
    // Only include properties that actually exist on the Post schema to prevent injecting arbitrary columns
    if (Object.hasOwn(updateData, key) &&
        ['userId', 'title', 'content', 'image', 'category', 'slug'].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    }
  }

  // If no fields are provided for update, return the existing post without changes
  if (fields.length === 0) {
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
    return rows[0];
  }

  // MySQL's `ON UPDATE CURRENT_TIMESTAMP` handles `updatedAt` automatically if defined in the table.
  // If not, you'd manually add `updatedAt = CURRENT_TIMESTAMP` to `fields` and `values` here.

  const query = `
    UPDATE posts
    SET ${fields.join(', ')}
    WHERE id = ?
  `;
  values.push(id); // Add the ID for the WHERE clause

  try {
    const [result] = await pool.execute(query, values);
    if (result.affectedRows === 0) {
      return undefined; // Post not found or no changes made
    }
    // Fetch the updated post to return its current state
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('❌ Error updating post:', error);
    throw error;
  }
}

/**
 * Deletes a post by its ID.
 * @param {number} id - The ID of the post to delete.
 * @returns {Promise<boolean>} True if the post was deleted, false otherwise.
 */
export async function deletePost(id) {
  const query = 'DELETE FROM posts WHERE id = ?';
  try {
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0; // True if one or more rows were deleted
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    throw error;
  }
}