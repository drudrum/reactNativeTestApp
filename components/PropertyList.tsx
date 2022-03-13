import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Button, Icon } from 'react-native-elements';
import axios from 'axios';
import { serverUri } from '../constants';

type CardsComponentsProps = {};

type PropertyType = {
  _id: string;
  name: string;
  cardDesc: string;
}

interface IPropertyListState {
  properties: PropertyType[] | null
}

const PropertyList: React.FunctionComponent<CardsComponentsProps> = () => {
  const [state, setState] = useState<IPropertyListState>({
    properties: null
  })

  useEffect(() => {
    if (state.properties) return

    (async () => {
      const res = await axios.get(`${serverUri}/properties`)
      
      console.log('properties', res.data);
      //const p = properties as PropertyType[]
      setState ({ ...state, properties: res.data })
    })().catch((err) => {
      // TODO display error
    })
  }, [state.properties])
  return (
    <ScrollView>
      {!state.properties && <Text>Loading...</Text>}
      {
        state.properties && state.properties.map((property, i) => {
          return (
            <Card key={property._id}>
              <Card.Title>{property.name}</Card.Title>
              <Card.Divider />
              <Card.Image
                style={{ padding: 0 }}
                source={{
                  uri: `https://picsum.photos/seed/${property._id}/200`
                }}
              />
              <Text style={{ marginBottom: 10 }}>
                {property.cardDesc}
              </Text>
              <Button
                icon={
                  <Icon
                    name="attach-money"
                    color="#ffffff"
                    iconStyle={{ marginRight: 10 }}
                  />
                }
                buttonStyle={{
                  borderRadius: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  marginBottom: 0,
                }}
                title="Rent now"
              />
            </Card>
          )
        })
      }
    </ScrollView>
  );
};

export default PropertyList;