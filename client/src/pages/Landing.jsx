import styled from 'styled-components';
import Wrapper from '../assets/wrappers/LandingPage'
import main from '../assets/images/main.svg'
import { Link } from 'react-router-dom';
import { Logo } from '../components';

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className='container page'>
        <div className='info'>
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vel, inventore saepe ea maiores eveniet earum similique voluptate consequatur reiciendis ex deserunt consectetur, eius non, quae et dignissimos. Quas, magnam.
          </p>
          <Link to='/register' className='btn register-link'>Register</Link>
          <Link to='/login' className='btn'>Login / Demo User</Link>
        </div>
        <img src={main} alt='job hunt' className='img main-img' />
      </div>
    </Wrapper>
  );
};
export default Landing;