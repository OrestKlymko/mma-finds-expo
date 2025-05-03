import React, {useEffect, useState} from 'react';
import {FlatList, Keyboard, StyleSheet, Text, TextInputProps, TouchableOpacity, View,} from 'react-native';
import {countries} from 'countries-list';
import FloatingLabelInput from "./FloatingLabelInput";
import colors from "@/styles/colors";

type CountryInfo = {
  name: string;
  continent: string;
};

const COUNTRY_LIST: CountryInfo[] = Object.entries(countries).map(
  ([, info]) => ({
    name: info.name,
    continent: info.continent,
  }),
);

interface CountryAutocompleteInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeCountry: (countryName: string) => void;
  onChangeContinent: (continentCode: string) => void;
  error?: boolean;
  containerStyle?: any;
}

export const CountryAutocompleteInput: React.FC<
  CountryAutocompleteInputProps
> = ({
       label,
       value,
       onChangeCountry,
       onChangeContinent,
       error,
       containerStyle,
       ...props
     }) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<CountryInfo[]>([]);
  const [showList, setShowList] = useState(false);

  /* синхронізуємо внутрішній стейт із пропом value */
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleChange = (text: string) => {
    if(query === text){
      setShowList(false);
      setSuggestions([]);
      return;
    }
    setQuery(text);

    const lower = text.toLowerCase();
    const filtered = COUNTRY_LIST.filter(c =>
      c.name.toLowerCase().startsWith(lower),
    ).slice(0, 10);

    setSuggestions(filtered);
    setShowList(filtered.length > 0)
  };

  const handleSelect = (item: CountryInfo) => {
    onChangeCountry(item.name);
    onChangeContinent(item.continent);
    setQuery(item.name);
    setSuggestions([]);
    setShowList(false);
    Keyboard.dismiss();
  };

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        error && {borderColor: colors.error},
      ]}>
      <FloatingLabelInput
        label={label}
        value={query}
        onChangeText={handleChange}
        /* Закриваємо список, коли поле втрачає фокус */
        onBlur={() => setShowList(false)}
        /* Відкриваємо лише, якщо вже є пропозиції */
        onFocus={() => suggestions.length && setShowList(true)}
        {...props}
      />

      {showList && (
        <View style={styles.listContainer}>
          <FlatList
            scrollEnabled={false}
            keyboardShouldPersistTaps="always"
            data={suggestions}
            keyExtractor={item => item.name}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}>
                <Text style={styles.itemText}>
                  {item.name}{' '}
                  <Text style={styles.continentText}>({item.continent})</Text>
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 16,
    overflow: 'visible',
    zIndex: 10000,
  },
  listContainer: {
    position: 'absolute',
    top: 60, /* 56 + 4 */
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    zIndex: 10000,
    elevation: 10000,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  itemText: {
    fontSize: 16,
    color: colors.primaryBlack,
  },
  continentText: {
    fontSize: 14,
    color: colors.gray,
  },
});
