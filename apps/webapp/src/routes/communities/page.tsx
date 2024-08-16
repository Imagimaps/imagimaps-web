import { Link } from '@modern-js/runtime/router';

const CommunitiesPage: React.FC = () => {
  return (
    <div>
      <h1>Communities Page</h1>
      <div>
        <h2>Test Community</h2>
        <Link to="/cartography/0">Go to community</Link>
      </div>
    </div>
  );
};

export default CommunitiesPage;
