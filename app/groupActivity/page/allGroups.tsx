import React from 'react';
import { ScrollView } from '../../../components/Themed';
import ItemsActivity from '../../../components/utilis/ItemsActivity';
import SearchGroup from '../../../components/utilis/searchGroup';

const AllGroups = () => {
  return (
    <ScrollView>
      <SearchGroup />
      <ItemsActivity />
    </ScrollView>
  );
};
export default AllGroups;
