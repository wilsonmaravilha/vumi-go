import csv

from go.contacts.parsers import ContactFileParser, ContactParserException

from django.utils.datastructures import SortedDict


class CSVFileParser(ContactFileParser):

    def read_data_from_file(self, file_path, field_names, has_header):
        try:
            csvfile = open(self.get_real_path(file_path), 'rU')
            dialect = csv.Sniffer().sniff(csvfile.read(1024))
            csvfile.seek(0)
            reader = csv.DictReader(csvfile, field_names, dialect=dialect)
            if has_header:
                reader.next()
            for row in reader:
                # Only process rows that actually have data
                if any([column for column in row]):
                    # Our Riak client requires unicode for all keys & values
                    # stored.
                    unicoded_row = dict([(key, unicode(value or '', 'utf-8'))
                                            for key, value in row.items()])
                    yield unicoded_row
        except (csv.Error,), e:
            raise ContactParserException(e)

    def guess_headers_and_row(self, file_path):
        """
        Take a sample from the CSV data and determine if it has a header
        and provide a sample of the header if found along with existing
        values matched against the known headers.

        returns a Tuple:

            (header_found, known_headers, sample_data_row)
        """
        try:
            fp = open(self.get_real_path(file_path), 'rU')
            dialect = csv.Sniffer().sniff(fp.read(1024))
            fp.seek(0)
        except (csv.Error,), e:
            raise ContactParserException(e)

        first_row, second_row = None, None

        try:
            reader = csv.reader(fp, dialect=dialect)
            first_row = reader.next()
            second_row = reader.next()
        except StopIteration:
            if first_row is None:
                raise ContactParserException('Invalid CSV file.')

        default_headers = self.DEFAULT_HEADERS.copy()

        if self.is_header_row(first_row) and second_row is not None:
            sample_row = SortedDict(zip(first_row, second_row))
            for column in first_row:
                default_headers.setdefault(column, column)
            return True, default_headers, sample_row
        return (False, default_headers,
            SortedDict([(column, column) for column in first_row]))
