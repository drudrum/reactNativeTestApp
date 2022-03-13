import { RootTabScreenProps } from '../types';
import PropertyList from '../components/PropertyList';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (<PropertyList/>);
}

