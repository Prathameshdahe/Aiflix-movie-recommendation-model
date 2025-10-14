import React from 'react'

const Footer = () => {
  return (
    <div className='text-[#737373] md:px-10'>
        <div className='py-20'>
        <p>Developed by Group 2</p>
        <p>Read about Netflix TV shows and movies and watch bonus videos on 
        Tudum.com </p>
        </div>
        <p className='pb-5'>Questions? Contact Us.</p>

        <div className='grid grid-cols-2 md:grid-cols-4 text-sm pb-10 max-w-5xl'>
            <ul className='flex flex-col space-y-2'>
                <li>FAQ</li>
                <li>Investory Relations</li>
                <li>Privacy</li>
                <li>Speed Test</li>
            </ul>

            <ul className='flex flex-col space-y-2'>
                <li>Help Center</li>
                <li>Jobs</li>
                <li>Cookie Preferences</li>
                <li>Legal Notices</li>
            </ul>

            <ul className='flex flex-col space-y-2'>
                <li>Account</li>
                <li>Ways to Watch</li>
                <li>Corporate Information</li>
                <li>Only on Netflix</li>
            </ul>

            <ul className='flex flex-col space-y-2'>
                <li>Media Center</li>
                <li>Terms of Use</li>
                <li>Contact Us</li>
            </ul>
        </div>
    </div>
  )
}

export default Footer
