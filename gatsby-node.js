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
  })
 
}