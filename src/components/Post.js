import React from "react"
import { Link} from "gatsby"
import Img from 'gatsby-image'
import {Badge,Card,CardBody,CardTitle,CardSubtitle, CardText} from "reactstrap"
import {slugify} from '../util/utility'
const Post=({title,author,fluid,date,slug,body,tags})=>{
    return(
        <Card>
            <Link to={`/${slug}`}><Img className='card-image-top' fluid={fluid}/></Link>
            <CardBody>
                <CardTitle>{title}</CardTitle>
                <CardSubtitle>
                 <span className='text-info'>{date}</span> by {' '}
                 <span className='text-info'>{author}</span>
                </CardSubtitle>
                <CardText>{body}</CardText>
                <ul className='post-tags'>
                    {
                        tags.map(tag=>(
                               <li key={tag}>
                                   <Link to={`/tag/${slugify(tag)}`}>
                                      <Badge color="primary">{tag}</Badge>
                                   </Link>
                               </li>
                        ))
                    }
                </ul>
                <Link  to={`/${slug}`}  className="btn btn-outline-primary float-right">Read More</Link>
            </CardBody>
        </Card>
    )
}
export default Post;