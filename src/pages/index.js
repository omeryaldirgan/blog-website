import React from "react"
import {graphql,StaticQuery} from "gatsby"
import Post from '../components/Post'
import Layout from "../components/Layout"
import SEO from "../components/Seo"
const IndexPage = () => (
  <Layout pageTitle="Home ">
    <SEO title="Home" />
       <StaticQuery query={indexQuery} render={data=>{
            return(
              <div>
                {data.allMarkdownRemark.edges.map(({node})=>(
                
                  <Post 
                      key={node.id}
                      title={node.frontmatter.title}
                      author={node.frontmatter.author}
                      image={node.frontmatter.image}
                      date={node.frontmatter.date}
                      body={node.excerpt}
                      fluid={node.frontmatter.image.childImageSharp.fluid}
                      slug={node.fields.slug}
                      tags={node.frontmatter.tags}
                  />
                ))}
              </div>
            )
          }}/>

  </Layout>
)
const indexQuery=graphql
`
{
  allMarkdownRemark(
    sort: { fields: [frontmatter___date], order: DESC }
    limit:2
   ){
    edges {
      node {
        id
        frontmatter {
          title
          date(formatString: "MMM Do YYYY")
          author
          tags
          image {
            childImageSharp {
              fluid(maxWidth:600) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
        excerpt
        fields {
          slug
        }
      }
    }
  }
}
`
export default IndexPage
