package co.edu.eci.arep.WebApplication.repository;

import co.edu.eci.arep.WebApplication.model.Property;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface PropertyRepository extends CrudRepository<Property, Long> {

    Optional<Property> findByAddress(String address);
    Optional<Property> findById(Long id);

    Object findAll(Specification<Property> spec);
}
