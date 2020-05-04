const { slugify } = require('./src/util/utility');
const path = require('path');
const authors = require('./src/util/authors')
const _ = require('lodash');

exports.onCreateNode = ({ node, actions }) => {
    const { createNodeField } = actions
    if (node.internal.type === 'MarkdownRemark') {
      const slugFromTitle = slugify(node.frontmatter.title)
      createNodeField({
        node,
        name: 'slug',
        value: slugFromTitle,
      })
    }
}

exports.createPages=({actions,graphql})=>{
  const {createPage}=actions
  const tagsPage = path.resolve(`src/templates/tags-page.js`)
  // Page templates
  const templates = {
    singlePost: path.resolve('src/templates/single-post.js'),
    //tagsPage: path.resolve('src/templates/tags-page.js'),
    tagPosts: path.resolve('src/templates/tag-posts.js'),
    postList:path.resolve('src/templates/post-list.js')
  }
//graphql
  return graphql(`
     {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              author
              tags
            }
            fields {
              slug
            }
          }
        }
      }
     }
  `).then(res=>{
    if(res.errors)return Promise.rejects(res.errors)

    const posts=res.data.allMarkdownRemark.edges
    //create single blog post pages
    posts.forEach(({node})=>{
       createPage({
          path:node.fields.slug,
          component:templates.singlePost,
          context:{
            //passing slug for template to use to fetch the post
            slug:node.fields.slug,
            // Find author imageUrl from author array and pass it to template
            imageUrl: authors.find(x => x.name === node.frontmatter.author).imageUrl,
          }
       })
    })
     //get all tags
     let tags=[]
  
       _.each(posts,edge=>{
        if(_.get(edge,'node.frontmatter.tags')){
          tags=tags.concat(edge.node.frontmatter.tags)
        }
       })

       //['design','code',...]
       //{design:%,code:6,...}
       let tagsPostCounts={}
       tags.forEach(edge=>{
        tagsPostCounts[edge]=(tagsPostCounts[edge] || 0) + 1
       })
       tags=_.uniq(tags)
       //create tags page
       createPage({
         path:'/tags',
         component:tagsPage,
         context:{
           tags,
           tagsPostCounts
         }
       })

   //Create tag posts pages
   tags.forEach(tag=>{
     createPage({
       path:`/tag/${slugify(tag)}`,
       component:templates.tagPosts,
       context:{
         tag
       }
     })
   })
   // Create posts pagination pages
   const postsPerPage = 2
   const numberOfPages = Math.ceil(posts.length / postsPerPage)

  Array.from({ length: numberOfPages }).forEach((_, index) => {
    const isFirstPage = index === 0
    const currentPage = index + 1

    // Skip first page because of index.js
    if (isFirstPage) return

    createPage({
      path: `/page/${currentPage}`,
      component: templates.postList,
      context: {
        limit: postsPerPage,
        skip: index * postsPerPage,
        numberOfPages: numberOfPages,
        currentPage: currentPage,
      },
    })
  })


  })
}