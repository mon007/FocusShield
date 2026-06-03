import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
  },

  active: {
    borderWidth: 2,
  },
});