import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

type Props = {
  name: string;
  selected: boolean;
  onPress: () => void;
};

export default function AppCard({
  name,
  selected,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selected,
      ]}
      onPress={onPress}>
      <Text style={styles.text}>
        {selected ? '☑' : '☐'} {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  selected: {
    borderWidth: 2,
  },

  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});