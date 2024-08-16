import { Link } from '@modern-js/runtime/router';

const WorldPage: React.FC = () => {
  return (
    <div>
      <h1>World Page</h1>
      <p>Details of the world</p>
      <p>List of Maps within this world</p>
      <div>
        <h2>Maps</h2>
        <ul>
          <li>
            <Link to="0">Test Map</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WorldPage;
