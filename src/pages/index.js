import React from "react"
import {graphql,StaticQuery} from "gatsby"
import Post from '../components/Post'
import Layout from "../components/Layout"
import SEO from "../components/Seo"
import PagenationLinks from '../components/PagintionLinks'

const IndexPage = () => {

  const postsPerPage=2;
  let numberOfPages
  return(
  <Layout pageTitle="Home ">
    <SEO title="Home" />
       <StaticQuery query={indexQuery} render={data=>{
         numberOfPages=Math.ceil(data.allMarkdownRemark.totalCount /postsPerPage )
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
    <PagenationLinks currentPage={1} numberOfPages={numberOfPages}></PagenationLinks>
  </Layout>
)
        }

const indexQuery=graphql
`
{
  allMarkdownRemark(
    sort: { fields: [frontmatter___date], order: DESC }
    limit:2
   ){
    totalCount
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
