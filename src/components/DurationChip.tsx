import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors } from '../theme/colors';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export default function DurationChip({
  label,
  active,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        active && styles.active,
      ]}
      onPress={onPress}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingHorizontal:16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginTop:10
  },

  active: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
});