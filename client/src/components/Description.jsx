import React from 'react'
import { assets } from '../assets/assets'
import { delay, motion } from "motion/react"

const Description = () => {
  return (
    
       <motion.div
        initial={{opacity:0.2, y:100}}
        transition={{duration:1}}
        whileInView={{opacity:1,y:0}}
        viewport={{once:true}}
       
        className="flex flex-col justify-center items-center my-24 px-6 sm:px-10 md:px-14 lg:px-28">
      
      <h1 className="font-semibold text-3xl sm:text-4xl mb-2">
        Create AI Images
      </h1>
      <p className="text-gray-500 mb-12 text-center">
        Turn your imagination into visuals
      </p>

      {/* CONTENT SECTION */}
      <div className="flex flex-col gap-8 items-center
                      min-[1300px]:flex-row min-[1300px]:gap-14">

        {/* IMAGE */}
        <img
          src={assets.sample_img_1}
          alt="AI sample"
          className="w-80 xl:w-96 rounded-lg"
        />

        {/* TEXT */}
        <div className="">
          <h2 className="text-3xl font-medium mb-4 text-left">
            Introducing the AI-Powered Text to Image Generator
          </h2>

          <p className="text-gray-600 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium voluptatibus fuga necessitatibus repellendus a vitae. Quibusdam excepturi nemo omnis, hic veritatis nesciunt suscipit sed debitis fugiat optio, est aspernatur vel maxime nulla at dolores vero tempora ipsum dolorum perspiciatis. Error hic consectetur dolorum necessitatibus perspiciatis magni illo est eius voluptatum!
          </p>

          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt rerum impedit vero esse molestiae nemo similique natus necessitatibus, molestias, voluptas quo nostrum quis ratione et architecto dolore saepe illum, porro aperiam amet optio autem laudantium voluptate eligendi? Blanditiis, corporis alias
          </p>
        </div>

      </div>
    </motion.div>
  )
}

export default Description
