// Blog page 

import BlogSection from '@/components/blog-section';

const blogPosts = [
  {
    id: 1,
    image: 'blog1.jpg',
    title: 'Bed Room',
    subtitle: 'The standard chunk',
    description: 'If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text.'
  },
  {
    id: 2,
    image: 'blog2.jpg',
    title: 'Living Room',
    subtitle: 'Another standard chunk',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
  },
  {
    id: 3,
    image: 'blog3.jpg',
    title: 'Dining Room',
    subtitle: 'Yet another chunk',
    description: 'Lorem Ipsum has been the industry standard dummy text ever since the 1500s.'
  }
];

export default function BlogPage() {
  return <BlogSection posts={blogPosts} />;
} 