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
    <Text
  style={[
    styles.text,
    active && styles.activeText,
  ]}>
  {label}
</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: '#FFF',
  },

active: {
  backgroundColor: Colors.primary,
  borderColor: Colors.primary,

  shadowColor: Colors.primary,
  shadowOpacity: 0.25,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 4,
  },

  elevation: 4,
},

  text: {
    color: Colors.text,
    fontWeight: '500',
  },

  activeText: {
    color: '#FFF',
    fontWeight: '600',
  },
});