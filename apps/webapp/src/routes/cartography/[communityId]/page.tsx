import { Link } from '@modern-js/runtime/router';

const CommunityPage: React.FC = () => {
  return (
    <div>
      <h1>Community Page</h1>
      <div>
        <h2>Test World</h2>
        <Link to="0">Go to world</Link>
      </div>
    </div>
  );
};

export default CommunityPage;
