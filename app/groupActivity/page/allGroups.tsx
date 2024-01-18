import React, { useState } from 'react';
import { ScrollView } from '../../../components/Themed';
import ItemsActivity from '../../../components/utilis/ItemsActivity';
import SearchGroup from '../../../components/utilis/searchGroup';

const AllGroups = () => {
  const [text, setText] = useState('');
  return (
    <ScrollView>
      <SearchGroup setText={setText} />
      <ItemsActivity text={text} />
    </ScrollView>
  );
};
export default AllGroups;
