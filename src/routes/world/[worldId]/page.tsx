import { useLoaderData } from '@modern-js/runtime/router';
import { UserWorldData } from './page.data';
import EditableTitleRow from '@/components/editable-rows/title';

const UserWorldPage: React.FC = () => {
  const data = useLoaderData() as UserWorldData;

  return (
    <div>
      <EditableTitleRow value={data.world.name} editMode={false} />
      <p className="small">{data.world.id}</p>
      <p>{data.world.description}</p>
      <div>Maps</div>
    </div>
  );
};

export default UserWorldPage;
