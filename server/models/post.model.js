// postModel.js
import connection from '../database.js';

/**
 * Create posts table if it doesn't exist
 */
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
    await connection.promise().query(query);
    console.log('✅ Posts table created or already exists.');
  } catch (error) {
    console.error('❌ Error creating posts table:', error);
    throw error;
  }
}

export async function createPost(postData) {
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
    const [result] = await connection.promise().execute(query, [userId, title, content, image, category, slug]);
    const [rows] = await connection.promise().query('SELECT * FROM posts WHERE id = ?', [result.insertId]);
    return rows[0];
  } catch (error) {
    console.error('❌ Error creating post:', error);
    throw error;
  }
}

export async function getAllPosts() {
  const query = 'SELECT * FROM posts ORDER BY createdAt DESC';
  try {
    const [rows] = await connection.promise().query(query);
    return rows;
  } catch (error) {
    console.error('❌ Error fetching all posts:', error);
    throw error;
  }
}

export async function getPostBySlug(slug) {
  const query = 'SELECT * FROM posts WHERE slug = ?';
  try {
    const [rows] = await connection.promise().execute(query, [slug]);
    return rows[0];
  } catch (error) {
    console.error('❌ Error fetching post by slug:', error);
    throw error;
  }
}

export async function updatePost(id, updateData) {
  const fields = [];
  const values = [];

  for (const key in updateData) {
    if (Object.hasOwn(updateData, key) &&
        ['userId', 'title', 'content', 'image', 'category', 'slug'].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    }
  }

  if (fields.length === 0) {
    const [rows] = await connection.promise().query('SELECT * FROM posts WHERE id = ?', [id]);
    return rows[0];
  }

  const query = `
    UPDATE posts
    SET ${fields.join(', ')}
    WHERE id = ?
  `;
  values.push(id);

  try {
    const [result] = await connection.promise().execute(query, values);
    if (result.affectedRows === 0) {
      return undefined;
    }
    const [rows] = await connection.promise().query('SELECT * FROM posts WHERE id = ?', [id]);
    return rows[0];
  } catch (error) {
    console.error('❌ Error updating post:', error);
    throw error;
  }
}

export async function deletePost(id) {
  const query = 'DELETE FROM posts WHERE id = ?';
  try {
    const [result] = await connection.promise().execute(query, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    throw error;
  }
}

export async function countPosts() {
  const query = 'SELECT COUNT(*) AS count FROM posts';
  try {
    const [rows] = await connection.promise().query(query);
    return rows[0].count;
  } catch (error) {
    console.error('❌ Error counting posts:', error);
    throw error;
  }
}

export async function countPostsCreatedSince(date) {
  const query = 'SELECT COUNT(*) AS count FROM posts WHERE createdAt >= ?';
  try {
    const [rows] = await connection.promise().execute(query, [date]);
    return rows[0].count;
  } catch (error) {
    console.error('❌ Error counting posts created since:', error);
    throw error;
  }
}
